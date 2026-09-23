'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
    BookOpen,
    Building2,
    Check,
    CircleCheck,
    GraduationCap,
    Loader2,
    Send,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/providers/ToastProvider';
import { cn } from '@/lib/utils';
import {
    ACADEMIC_SUPPORT,
    ACADEMIC_SUPPORT_LABELS,
    COMPETITIVE_EXAMS,
    CURRICULUMS,
    CURRICULUM_LABELS,
    EXAM_LABELS,
    FEEDBACK_LIMITS,
    FEEDBACK_NEEDS,
    JOB_TYPES,
    JOB_TYPE_LABELS,
    NEED_LABELS,
    REGISTRATION_TYPE_LABELS,
    validateFeedbackInput,
    type AcademicSupport,
    type CompetitiveExam,
    type Curriculum,
    type FeedbackErrors,
    type FeedbackField,
    type FeedbackNeed,
    type JobType,
    type RegistrationType,
} from '@/lib/feedback';

const REGISTRATION_OPTIONS: {
    value: RegistrationType;
    icon: LucideIcon;
    hint: string;
    selectedClass: string;
    iconClass: string;
}[] = [
    {
        value: 'student',
        icon: GraduationCap,
        hint: 'Learning for myself',
        selectedClass: 'border-sky-500 bg-sky-50',
        iconClass: 'bg-sky-100 text-sky-600',
    },
    {
        value: 'parent',
        icon: Users,
        hint: 'On behalf of my child',
        selectedClass: 'border-violet-500 bg-violet-50',
        iconClass: 'bg-violet-100 text-violet-600',
    },
    {
        value: 'teacher',
        icon: BookOpen,
        hint: 'Tutor or educator',
        selectedClass: 'border-emerald-500 bg-emerald-50',
        iconClass: 'bg-emerald-100 text-emerald-600',
    },
    {
        value: 'institution',
        icon: Building2,
        hint: 'School, college or business',
        selectedClass: 'border-amber-500 bg-amber-50',
        iconClass: 'bg-amber-100 text-amber-600',
    },
];

interface FormState {
    registrationType: RegistrationType | '';
    name: string;
    phone: string;
    alternativePhone: string;
    whatsapp: string;
    whatsappSameAsPhone: boolean;
    email: string;
    address: string;
    needs: FeedbackNeed[];
    curriculums: Curriculum[];
    exams: CompetitiveExam[];
    academicSupport: AcademicSupport[];
    jobTypes: JobType[];
    partnershipInterest: boolean | null;
    productDemoInterest: boolean | null;
}

type OptionField = 'needs' | 'curriculums' | 'exams' | 'academicSupport' | 'jobTypes';

const INITIAL_FORM: FormState = {
    registrationType: '',
    name: '',
    phone: '',
    alternativePhone: '',
    whatsapp: '',
    whatsappSameAsPhone: true,
    email: '',
    address: '',
    needs: [],
    curriculums: [],
    exams: [],
    academicSupport: [],
    jobTypes: [],
    partnershipInterest: null,
    productDemoInterest: null,
};

function FieldError({ field, message }: { field: FeedbackField; message?: string }) {
    if (!message) return null;
    return (
        <p id={`feedback-${field}-error`} className="text-sm text-red-600">
            {message}
        </p>
    );
}

function RequiredMark() {
    return <span className="text-secondary">*</span>;
}

// A checkbox or radio button styled as a pill
function ChoicePill({
    id,
    type,
    name,
    checked,
    onChange,
    children,
}: {
    id: string;
    type: 'checkbox' | 'radio';
    name: string;
    checked: boolean;
    onChange: () => void;
    children: React.ReactNode;
}) {
    return (
        <label
            className={cn(
                'inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary has-[:focus-visible]:ring-offset-2',
                checked
                    ? 'border-sky-500 bg-sky-50 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            )}
        >
            <input
                type={type}
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <span
                aria-hidden="true"
                className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center border transition-colors',
                    type === 'radio' ? 'rounded-full' : 'rounded',
                    checked ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300 bg-white',
                )}
            >
                {checked &&
                    (type === 'radio' ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    ) : (
                        <Check size={12} strokeWidth={3} />
                    ))}
            </span>
            {children}
        </label>
    );
}

// Fieldset wiring shared by the choice groups. The first option carries the field's id so a
// validation error can move focus into the group.
function ChoiceFieldset({
    field,
    legend,
    required,
    hint,
    error,
    children,
}: {
    field: FeedbackField;
    legend: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    const describedBy = [hint && `feedback-${field}-hint`, error && `feedback-${field}-error`]
        .filter(Boolean)
        .join(' ');

    return (
        <fieldset aria-describedby={describedBy || undefined} className="min-w-0">
            <legend className={cn('text-sm font-medium text-slate-900', hint ? 'mb-1' : 'mb-3')}>
                {legend} {required && <RequiredMark />}
            </legend>
            {hint && (
                <p id={`feedback-${field}-hint`} className="mb-3 text-xs text-slate-500">
                    {hint}
                </p>
            )}
            <div className="flex flex-wrap gap-2">{children}</div>
            <div className="mt-2">
                <FieldError field={field} message={error} />
            </div>
        </fieldset>
    );
}

function OptionGroup<T extends string>({
    field,
    legend,
    required,
    hint,
    options,
    labels,
    selected,
    onToggle,
    error,
}: {
    field: FeedbackField;
    legend: string;
    required?: boolean;
    hint?: string;
    options: readonly T[];
    labels: Record<T, string>;
    selected: readonly T[];
    onToggle: (value: T) => void;
    error?: string;
}) {
    return (
        <ChoiceFieldset field={field} legend={legend} required={required} hint={hint} error={error}>
            {options.map((option, index) => (
                <ChoicePill
                    key={option}
                    type="checkbox"
                    id={index === 0 ? `feedback-${field}` : `feedback-${field}-${option}`}
                    name={field}
                    checked={selected.includes(option)}
                    onChange={() => onToggle(option)}
                >
                    {labels[option]}
                </ChoicePill>
            ))}
        </ChoiceFieldset>
    );
}

function YesNoQuestion({
    field,
    legend,
    value,
    onChange,
    error,
}: {
    field: FeedbackField;
    legend: string;
    value: boolean | null;
    onChange: (value: boolean) => void;
    error?: string;
}) {
    return (
        <ChoiceFieldset field={field} legend={legend} error={error}>
            {[true, false].map((option) => (
                <ChoicePill
                    key={String(option)}
                    type="radio"
                    id={option ? `feedback-${field}` : `feedback-${field}-no`}
                    name={field}
                    checked={value === option}
                    onChange={() => onChange(option)}
                >
                    {option ? 'Yes' : 'No'}
                </ChoicePill>
            ))}
        </ChoiceFieldset>
    );
}

export default function FeedbackForm() {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FeedbackErrors>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const successHeadingRef = useRef<HTMLHeadingElement>(null);
    const { addToast } = useToast();

    const isSubmitting = status === 'loading';

    useEffect(() => {
        if (status === 'success') successHeadingRef.current?.focus();
    }, [status]);

    const clearError = (field: FeedbackField) =>
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

    const updateField = <K extends FeedbackField>(field: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        clearError(field);
    };

    const toggleOption = <K extends OptionField>(field: K, value: FormState[K][number]) => {
        setForm((prev) => {
            const current: readonly string[] = prev[field];
            return {
                ...prev,
                [field]: current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value],
            };
        });
        clearError(field);
    };

    const setWhatsappSameAsPhone = (checked: boolean) => {
        setForm((prev) => ({ ...prev, whatsappSameAsPhone: checked }));
        clearError('whatsapp');
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

        const result = validateFeedbackInput({
            ...form,
            whatsapp: form.whatsappSameAsPhone ? form.phone : form.whatsapp,
        });
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
            addToast(data.error || 'Failed to submit the form', 'error');
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
                    Thank you for reaching out!
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                    Our team will review your details and get in touch using the phone number,
                    WhatsApp or email address you provided.
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
                        Submit Another Response
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
                        <h2 className="text-2xl font-bold text-slate-900">Tell Us About You</h2>
                        <p className="text-sm text-slate-500">
                            Fields marked <RequiredMark /> are required
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <fieldset disabled={isSubmitting} className="space-y-8 min-w-0">
                        {/* Registration Type */}
                        <fieldset
                            aria-describedby={
                                errors.registrationType
                                    ? 'feedback-registrationType-error'
                                    : undefined
                            }
                        >
                            <legend className="text-sm font-medium text-slate-900 mb-3">
                                Registration type <RequiredMark />
                            </legend>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {REGISTRATION_OPTIONS.map((option, index) => {
                                    const isSelected = form.registrationType === option.value;
                                    return (
                                        <label
                                            key={option.value}
                                            className={cn(
                                                'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary has-[:focus-visible]:ring-offset-2',
                                                isSelected
                                                    ? option.selectedClass
                                                    : errors.registrationType
                                                      ? 'border-red-300 bg-white hover:bg-slate-50'
                                                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="registrationType"
                                                id={
                                                    index === 0
                                                        ? 'feedback-registrationType'
                                                        : `feedback-registrationType-${option.value}`
                                                }
                                                value={option.value}
                                                checked={isSelected}
                                                onChange={() =>
                                                    updateField('registrationType', option.value)
                                                }
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
                                                {REGISTRATION_TYPE_LABELS[option.value]}
                                            </span>
                                            <span className="text-xs leading-snug text-slate-500">
                                                {option.hint}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="mt-2">
                                <FieldError
                                    field="registrationType"
                                    message={errors.registrationType}
                                />
                            </div>
                        </fieldset>

                        {/* Contact Details */}
                        <div className="grid gap-3">
                            <Label htmlFor="feedback-name">
                                Name <RequiredMark />
                            </Label>
                            <Input
                                {...fieldProps('name')}
                                type="text"
                                autoComplete="name"
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                maxLength={FEEDBACK_LIMITS.name.max}
                                placeholder="Enter your full name"
                                className={cn(errorClass('name'))}
                            />
                            <FieldError field="name" message={errors.name} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-3 content-start">
                                <Label htmlFor="feedback-phone">
                                    Phone Number <RequiredMark />
                                </Label>
                                <Input
                                    {...fieldProps('phone')}
                                    type="tel"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    maxLength={FEEDBACK_LIMITS.phone.max}
                                    placeholder="e.g. +91 98765 43210"
                                    className={cn(errorClass('phone'))}
                                />
                                <FieldError field="phone" message={errors.phone} />
                            </div>
                            <div className="grid gap-3 content-start">
                                <Label htmlFor="feedback-alternativePhone">
                                    Alternative Number{' '}
                                    <span className="font-normal text-slate-400">(if any)</span>
                                </Label>
                                <Input
                                    {...fieldProps('alternativePhone')}
                                    type="tel"
                                    autoComplete="off"
                                    value={form.alternativePhone}
                                    onChange={(e) =>
                                        updateField('alternativePhone', e.target.value)
                                    }
                                    maxLength={FEEDBACK_LIMITS.phone.max}
                                    placeholder="Another number we can reach you on"
                                    className={cn(errorClass('alternativePhone'))}
                                />
                                <FieldError
                                    field="alternativePhone"
                                    message={errors.alternativePhone}
                                />
                            </div>
                            <div className="grid gap-3 content-start">
                                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                    <Label htmlFor="feedback-whatsapp">
                                        WhatsApp Number <RequiredMark />
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="feedback-whatsapp-same"
                                            className="border-slate-300 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                                            checked={form.whatsappSameAsPhone}
                                            onCheckedChange={(checked) =>
                                                setWhatsappSameAsPhone(checked === true)
                                            }
                                        />
                                        <Label
                                            htmlFor="feedback-whatsapp-same"
                                            className="font-normal text-slate-600 cursor-pointer"
                                        >
                                            Same as phone number
                                        </Label>
                                    </div>
                                </div>
                                <Input
                                    {...fieldProps('whatsapp')}
                                    type="tel"
                                    autoComplete="off"
                                    value={form.whatsappSameAsPhone ? form.phone : form.whatsapp}
                                    onChange={(e) => updateField('whatsapp', e.target.value)}
                                    disabled={form.whatsappSameAsPhone}
                                    maxLength={FEEDBACK_LIMITS.phone.max}
                                    placeholder={
                                        form.whatsappSameAsPhone
                                            ? 'Uses your phone number'
                                            : 'Enter your WhatsApp number'
                                    }
                                    className={cn(
                                        !form.whatsappSameAsPhone && errorClass('whatsapp'),
                                    )}
                                />
                                <FieldError
                                    field="whatsapp"
                                    message={form.whatsappSameAsPhone ? undefined : errors.whatsapp}
                                />
                            </div>
                            <div className="grid gap-3 content-start">
                                <Label htmlFor="feedback-email">
                                    Email <RequiredMark />
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

                        <div className="grid gap-3">
                            <Label htmlFor="feedback-address">Address</Label>
                            <Textarea
                                {...fieldProps('address')}
                                rows={3}
                                autoComplete="street-address"
                                value={form.address}
                                onChange={(e) => updateField('address', e.target.value)}
                                maxLength={FEEDBACK_LIMITS.address.max}
                                placeholder="Door number, street, area and city"
                                className={cn('resize-none', errorClass('address'))}
                            />
                            <FieldError field="address" message={errors.address} />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-8 border-t border-slate-100 pt-8">
                            <OptionGroup
                                field="needs"
                                legend="What do you need?"
                                required
                                hint="Choose all that apply."
                                options={FEEDBACK_NEEDS}
                                labels={NEED_LABELS}
                                selected={form.needs}
                                onToggle={(value) => toggleOption('needs', value)}
                                error={errors.needs}
                            />
                            <OptionGroup
                                field="curriculums"
                                legend="Curriculum & Board Support"
                                options={CURRICULUMS}
                                labels={CURRICULUM_LABELS}
                                selected={form.curriculums}
                                onToggle={(value) => toggleOption('curriculums', value)}
                                error={errors.curriculums}
                            />
                            <OptionGroup
                                field="exams"
                                legend="Competitive Exam Support"
                                options={COMPETITIVE_EXAMS}
                                labels={EXAM_LABELS}
                                selected={form.exams}
                                onToggle={(value) => toggleOption('exams', value)}
                                error={errors.exams}
                            />
                            <OptionGroup
                                field="academicSupport"
                                legend="Academic Support"
                                options={ACADEMIC_SUPPORT}
                                labels={ACADEMIC_SUPPORT_LABELS}
                                selected={form.academicSupport}
                                onToggle={(value) => toggleOption('academicSupport', value)}
                                error={errors.academicSupport}
                            />
                        </div>

                        {/* Role-specific and product questions */}
                        <div className="space-y-8 border-t border-slate-100 pt-8">
                            {form.registrationType === 'teacher' && (
                                <OptionGroup
                                    field="jobTypes"
                                    legend="Are you a teacher looking for a job?"
                                    hint="Choose the kind of work you're looking for, or leave it blank."
                                    options={JOB_TYPES}
                                    labels={JOB_TYPE_LABELS}
                                    selected={form.jobTypes}
                                    onToggle={(value) => toggleOption('jobTypes', value)}
                                    error={errors.jobTypes}
                                />
                            )}
                            {form.registrationType === 'institution' && (
                                <YesNoQuestion
                                    field="partnershipInterest"
                                    legend="Are you an institution looking for partnership support?"
                                    value={form.partnershipInterest}
                                    onChange={(value) => updateField('partnershipInterest', value)}
                                    error={errors.partnershipInterest}
                                />
                            )}
                            <YesNoQuestion
                                field="productDemoInterest"
                                legend="Would you like a demo of our products, such as Team Mistake software?"
                                value={form.productDemoInterest}
                                onChange={(value) => updateField('productDemoInterest', value)}
                                error={errors.productDemoInterest}
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            We only use your details to respond to this form. See our{' '}
                            <Link
                                href="/privacy-policy"
                                className="underline underline-offset-2 hover:text-slate-700"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>

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
                                    <span>Submit</span>
                                </>
                            )}
                        </motion.button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
