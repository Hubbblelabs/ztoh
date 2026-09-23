import type { Metadata } from 'next';
import { Eye, Mail, MessageSquareHeart, PencilLine, Phone, PhoneCall } from 'lucide-react';
import ScrollAnimation from '@/components/animations/ScrollAnimation';
import FeedbackForm from './FeedbackForm';

export const metadata: Metadata = {
    title: 'Feedback Form | Zero to Hero',
    description:
        'Tell Zero to Hero what you need: demos, enquiries, curriculum and competitive exam support, academic resources, teaching jobs or institutional partnerships.',
};

const steps = [
    {
        icon: PencilLine,
        title: 'You tell us',
        text: 'Choose who you are, add your contact details and tick what you need.',
    },
    {
        icon: Eye,
        title: 'We review',
        text: 'Every submission is read by our team and passed to the right people.',
    },
    {
        icon: PhoneCall,
        title: 'We get in touch',
        text: 'We call or WhatsApp you to plan the next steps.',
    },
];

export default function FeedbackPage() {
    return (
        <section className="relative overflow-hidden bg-slate-50 pt-32 pb-16 md:pt-40 md:pb-24">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
                    <ScrollAnimation>
                        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary">
                            <MessageSquareHeart size={16} className="text-secondary" />
                            We&apos;re Listening
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.1}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 mb-6">
                            Feedback{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                Form
                            </span>
                        </h1>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.2}>
                        <p className="text-lg text-slate-600">
                            Tell us who you are and what you&apos;re looking for, from demos and
                            enquiries to curriculum, exam and academic support. Our team will get in
                            touch.
                        </p>
                    </ScrollAnimation>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-12">
                    <ScrollAnimation delay={0.2} className="lg:col-span-3">
                        <FeedbackForm />
                    </ScrollAnimation>

                    <ScrollAnimation
                        delay={0.3}
                        className="space-y-6 lg:col-span-2 lg:sticky lg:top-28"
                    >
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/50">
                            <h2 className="mb-6 text-xl font-bold font-heading text-slate-900">
                                What happens next?
                            </h2>
                            <ol className="space-y-6">
                                {steps.map((step, index) => (
                                    <li key={step.title} className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-secondary">
                                            <step.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                <span className="mr-1.5 text-secondary">
                                                    {index + 1}.
                                                </span>
                                                {step.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                                {step.text}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-slate-300">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
                            <h2 className="relative text-lg font-bold text-white">
                                Need a quick answer?
                            </h2>
                            <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                                For enrolment or class questions, it&apos;s faster to reach us
                                directly.
                            </p>
                            <ul className="relative mt-5 space-y-3 text-sm">
                                <li>
                                    <a
                                        href="mailto:reachus@ztoh.org"
                                        className="inline-flex items-center gap-3 hover:text-white transition-colors"
                                    >
                                        <Mail size={16} className="text-secondary" />
                                        reachus@ztoh.org
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="tel:+919564321000"
                                        className="inline-flex items-center gap-3 hover:text-white transition-colors"
                                    >
                                        <Phone size={16} className="text-secondary" />
                                        +91 95643 21000
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
