'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
    ChevronDown,
    CircleCheck,
    Heart,
    Lightbulb,
    Loader2,
    MessageSquare,
    MessageSquareWarning,
    Send,
    Star,
    type LucideIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/providers/ToastProvider';
import { cn } from '@/lib/utils';
import {
    FEEDBACK_LIMITS,
    FEEDBACK_TOPICS,
    FEEDBACK_TOPIC_LABELS,
    FEEDBACK_TYPE_LABELS,
    RATING_LABELS,
    validateFeedbackInput,
    type FeedbackErrors,
    type FeedbackField,
    type FeedbackTopic,
    type FeedbackType,
} from '@/lib/feedback';

const TYPE_OPTIONS: {
    value: FeedbackType;
    icon: LucideIcon;
    hint: string;
    placeholder: string;
    selectedClass: string;
    iconClass: string;
}[] = [
    {
        value: 'general',
        icon: MessageSquare,
        hint: 'Share your thoughts',
        placeholder: 'Tell us about your experience with Zero to Hero...',
        selectedClass: 'border-sky-500 bg-sky-50',
        iconClass: 'bg-sky-100 text-sky-600',
    },
    {
        value: 'suggestion',
        icon: Lightbulb,
        hint: 'An idea to improve',
        placeholder: 'What would you like us to add or change, and how would it help?',
        selectedClass: 'border-amber-500 bg-amber-50',
        iconClass: 'bg-amber-100 text-amber-600',
    },
    {
        value: 'complaint',
        icon: MessageSquareWarning,
        hint: 'Something went wrong',
        placeholder: 'What went wrong? Include dates, classes or tutor names if relevant.',
        selectedClass: 'border-rose-500 bg-rose-50',
        iconClass: 'bg-rose-100 text-rose-600',
    },
    {
        value: 'praise',
        icon: Heart,
        hint: 'Something we did well',
        placeholder: 'What did we do well? Who made a difference for you?',
        selectedClass: 'border-emerald-500 bg-emerald-50',
        iconClass: 'bg-emerald-100 text-emerald-600',
    },
];

interface FormState {
    type: FeedbackType;
    rating: number | null;
    topic: FeedbackTopic | '';
    subject: string;
    message: string;
    name: string;
    email: string;
}

const INITIAL_FORM: FormState = {
    type: 'general',
    rating: null,
    topic: '',
    subject: '',
    message: '',
    name: '',
    email: '',
};

function FieldError({ field, message }: { field: FeedbackField; message?: string }) {
    if (!message) return null;
    return (
        <p id={`feedback-${field}-error`} className="text-sm text-red-600">
            {message}
        </p>
    );
}

export default function FeedbackForm() {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FeedbackErrors>({});
    const [hoverRating, setHoverRating] = useState(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const successHeadingRef = useRef<HTMLHeadingElement>(null);
    const { addToast } = useToast();

    const isSubmitting = status === 'loading';
    const selectedType = TYPE_OPTIONS.find((option) => option.value === form.type)!;
    const displayedRating = hoverRating || form.rating || 0;

    useEffect(() => {
        if (status === 'success') successHeadingRef.current?.focus();
    }, [status]);

    const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // Shared accessibility wiring for fields that can show an inline error
    const fieldProps = (field: FeedbackField) => ({
        id: `feedback-${field}`,
        'aria-invalid': errors[field] ? true : undefined,
        'aria-describedby': errors[field] ? `feedback-${field}-error` : undefined,
    });
    const errorClass = (field: FeedbackField) =>
        errors[field] && 'border-red-400 focus-visible:ring-red-400';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = validateFeedbackInput(form);
        if (!result.success) {
            setErrors(result.errors);
            const firstInvalid = Object.keys(result.errors)[0];
            document.getElementById(`feedback-${firstInvalid}`)?.focus();
            return;
        }

        if (!token) {
            addToast('Please complete the captcha', 'error');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...result.data, token }),
            });
            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setTrackingId(data.trackingId ?? null);
                setForm(INITIAL_FORM);
                setToken(null);
                setStatus('success');
                return;
            }

            if (data.errors) setErrors(data.errors);
            addToast(data.error || 'Failed to submit feedback', 'error');
        } catch {
            addToast('Something went wrong. Please try again.', 'error');
        }

        // Captcha tokens are single-use, so fetch a fresh one before the next attempt
        turnstileRef.current?.reset();
        setToken(null);
        setStatus('idle');
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="form-card p-8 md:p-12 text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CircleCheck className="text-green-600" size={40} />
                </div>
                <h2
                    ref={successHeadingRef}
                    tabIndex={-1}
                    className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-4 outline-none"
                >
                    Thank you for your feedback!
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                    Our team reads every submission. If we need more details, we&apos;ll reach out
                    using the email address you provided.
                </p>
                {trackingId && (
                    <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                        Reference number
                        <span className="font-mono font-semibold text-slate-900">{trackingId}</span>
                    </p>
                )}
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={() => setStatus('idle')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Share More Feedback
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="form-card p-6 sm:p-8 md:p-10">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/10 to-accent/5 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/20">
                        <Send className="text-white" size={18} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Share Your Feedback</h2>
                        <p className="text-sm text-slate-500">
                            Fields marked <span className="text-secondary">*</span> are required
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <fieldset disabled={isSubmitting} className="space-y-8 min-w-0">
                        {/* Feedback Type */}
                        <fieldset>
                            <legend className="text-sm font-medium text-slate-900 mb-3">
                                What kind of feedback is this?{' '}
                                <span className="text-secondary">*</span>
                            </legend>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {TYPE_OPTIONS.map((option) => {
                                    const isSelected = form.type === option.value;
                                    return (
                                        <label
                                            key={option.value}
                                            className={cn(
                                                'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary has-[:focus-visible]:ring-offset-2',
                                                isSelected
                                                    ? option.selectedClass
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                id={`feedback-type-${option.value}`}
                                                value={option.value}
                                                checked={isSelected}
                                                onChange={() => updateField('type', option.value)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={cn(
                                                    'w-10 h-10 rounded-xl flex items-center justify-center',
                                                    option.iconClass,
                                                )}
                                            >
                                                <option.icon size={20} />
                                            </span>
                                            <span className="text-sm font-semibold text-slate-900">
                                                {FEEDBACK_TYPE_LABELS[option.value]}
                                            </span>
                                            <span className="text-xs leading-snug text-slate-500">
                                                {option.hint}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        {/* Rating */}
                        <fieldset>
                            <legend className="text-sm font-medium text-slate-900 mb-3">
                                How would you rate your overall experience?{' '}
                                <span className="font-normal text-slate-400">(optional)</span>
                            </legend>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div
                                    className="flex items-center gap-1"
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <label
                                            key={value}
                                            onMouseEnter={() => setHoverRating(value)}
                                            className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary"
                                        >
                                            <input
                                                type="radio"
                                                name="rating"
                                                id={`feedback-rating-${value}`}
                                                value={value}
                                                checked={form.rating === value}
                                                onChange={() => updateField('rating', value)}
                                                className="sr-only"
                                            />
                                            <Star
                                                size={30}
                                                aria-hidden="true"
                                                className={cn(
                                                    'transition-colors',
                                                    value <= displayedRating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300',
                                                )}
                                            />
                                            <span className="sr-only">
                                                {value} out of 5, {RATING_LABELS[value - 1]}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <span
                                    aria-hidden="true"
                                    className="min-w-20 text-sm font-medium text-slate-600"
                                >
                                    {displayedRating
                                        ? RATING_LABELS[displayedRating - 1]
                                        : 'Not rated'}
                                </span>
                                {form.rating !== null && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setHoverRating(0);
                                            updateField('rating', null);
                                        }}
                                        className="text-sm text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
                                    >
                                        Clear rating
                                    </button>
                                )}
                            </div>
                            <FieldError field="rating" message={errors.rating} />
                        </fieldset>

                        {/* Topic */}
                        <div className="grid gap-3">
                            <Label htmlFor="feedback-topic">
                                What is it about? <span className="text-secondary">*</span>
                            </Label>
                            <div className="relative">
                                <select
                                    {...fieldProps('topic')}
                                    value={form.topic}
                                    onChange={(e) =>
                                        updateField('topic', e.target.value as FeedbackTopic)
                                    }
                                    className={cn(
                                        'flex h-10 w-full appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-10 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&_option]:text-slate-900',
                                        !form.topic && 'text-muted-foreground',
                                        errorClass('topic'),
                                    )}
                                >
                                    <option value="" disabled>
                                        Select a topic
                                    </option>
                                    {FEEDBACK_TOPICS.map((topic) => (
                                        <option key={topic} value={topic}>
                                            {FEEDBACK_TOPIC_LABELS[topic]}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                            <FieldError field="topic" message={errors.topic} />
                        </div>

                        {/* Subject */}
                        <div className="grid gap-3">
                            <Label htmlFor="feedback-subject">
                                Subject <span className="text-secondary">*</span>
                            </Label>
                            <Input
                                {...fieldProps('subject')}
                                type="text"
                                value={form.subject}
                                onChange={(e) => updateField('subject', e.target.value)}
                                maxLength={FEEDBACK_LIMITS.subject.max}
                                placeholder="A short summary of your feedback"
                                className={cn(errorClass('subject'))}
                            />
                            <FieldError field="subject" message={errors.subject} />
                        </div>

                        {/* Message */}
                        <div className="grid gap-3">
                            <Label htmlFor="feedback-message">
                                Your Message <span className="text-secondary">*</span>
                            </Label>
                            <Textarea
                                {...fieldProps('message')}
                                rows={6}
                                value={form.message}
                                onChange={(e) => updateField('message', e.target.value)}
                                maxLength={FEEDBACK_LIMITS.message.max}
                                placeholder={selectedType.placeholder}
                                className={cn('resize-none', errorClass('message'))}
                            />
                            <div className="flex items-start justify-between gap-4">
                                <FieldError field="message" message={errors.message} />
                                <span className="ml-auto shrink-0 text-xs tabular-nums text-slate-400">
                                    {form.message.length} / {FEEDBACK_LIMITS.message.max}
                                </span>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-3 content-start">
                                    <Label htmlFor="feedback-name">
                                        Your Name <span className="text-secondary">*</span>
                                    </Label>
                                    <Input
                                        {...fieldProps('name')}
                                        type="text"
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        maxLength={FEEDBACK_LIMITS.name.max}
                                        placeholder="Enter your name"
                                        className={cn(errorClass('name'))}
                                    />
                                    <FieldError field="name" message={errors.name} />
                                </div>
                                <div className="grid gap-3 content-start">
                                    <Label htmlFor="feedback-email">
                                        Your Email <span className="text-secondary">*</span>
                                    </Label>
                                    <Input
                                        {...fieldProps('email')}
                                        type="email"
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        maxLength={FEEDBACK_LIMITS.email.max}
                                        placeholder="Enter your email"
                                        className={cn(errorClass('email'))}
                                    />
                                    <FieldError field="email" message={errors.email} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">
                                We only use your contact details to follow up on this feedback. See
                                our{' '}
                                <Link
                                    href="/privacy-policy"
                                    className="underline underline-offset-2 hover:text-slate-700"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Turnstile
                                ref={turnstileRef}
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                                onSuccess={setToken}
                                onExpire={() => setToken(null)}
                                onError={() => setToken(null)}
                                injectScript={true}
                                options={{
                                    theme: 'light',
                                }}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-primary via-slate-800 to-primary text-white font-bold text-lg rounded-md shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden btn-shine"
                            style={{ backgroundSize: '200% 100%' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={22} />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Submit Feedback</span>
                                </>
                            )}
                        </motion.button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
