import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Zero to Hero',
    description:
        'Terms of Service for Zero to Hero Online and Home Tutoring Services. Read our terms and conditions for using our educational services.',
};

export default function TermsOfService() {
    return (
        <section className="py-24 md:py-32 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Last updated:{' '}
                        {new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12 space-y-10">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing and using the website and services of Zero to Hero Online
                            and Home Tutoring Services (&quot;we&quot;, &quot;us&quot;, or
                            &quot;our&quot;), you agree to be bound by these Terms of Service. If
                            you do not agree to these terms, please do not use our services.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            2. Description of Services
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Zero to Hero provides educational tutoring services including one-on-one
                            mentorship, group tutoring sessions, career guidance, and skill
                            development workshops. Our services cater to students across various
                            boards (CBSE, IB, IGCSE, State Board) and competitive examinations (JEE,
                            SAT, TANCET, GATE, and more). Services are offered both online and
                            in-person.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            3. User Accounts &amp; Registration
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            When you register for our services, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and promptly update your registration information</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            4. Payment Terms
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Payment for services is due as per the agreed-upon schedule. Fees are
                            subject to change with reasonable notice. Refund policies are as
                            follows:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>
                                Cancellation before the first session: Full refund minus processing
                                fees
                            </li>
                            <li>
                                Cancellation within the first week: Pro-rated refund based on
                                sessions completed
                            </li>
                            <li>Rescheduling requests must be made at least 24 hours in advance</li>
                            <li>No-shows will be counted as completed sessions</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            5. Code of Conduct
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Users of our platform are expected to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Treat tutors, staff, and fellow students with respect</li>
                            <li>Not engage in any form of academic dishonesty or plagiarism</li>
                            <li>
                                Not share course materials or recordings without prior authorization
                            </li>
                            <li>Maintain punctuality for scheduled sessions</li>
                            <li>Follow online session etiquette and guidelines</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            6. Intellectual Property
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            All content, materials, curriculum, and resources provided by Zero to
                            Hero are protected by intellectual property laws. Study materials,
                            lesson plans, recordings, and any other educational content are for
                            personal use only and may not be reproduced, distributed, or used
                            commercially without our express written consent.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            7. Limitation of Liability
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            While we strive to provide the highest quality educational services,
                            Zero to Hero does not guarantee specific academic outcomes, exam
                            results, or admission to institutions. Our services are supplementary in
                            nature and are designed to support and enhance a student&apos;s learning
                            journey. We shall not be held liable for any indirect, incidental, or
                            consequential damages arising from the use of our services.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            8. Termination
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to suspend or terminate your access to our services
                            at any time, with or without cause, if we believe you have violated
                            these terms of service. Upon termination, your right to use our services
                            will immediately cease. We may also terminate or suspend access without
                            prior notice if there is a breach of these terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            9. Governing Law
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            These terms shall be governed by and construed in accordance with the
                            laws of India. Any disputes arising under these terms shall be subject
                            to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu,
                            India.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            10. Changes to Terms
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. Changes will be
                            effective immediately upon posting to this page. Your continued use of
                            our services after any modifications indicates your acceptance of the
                            updated terms.
                        </p>
                    </div>

                    <div className="border-t border-slate-200 pt-8">
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            11. Contact Us
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact
                            us at:
                        </p>
                        <div className="mt-4 p-6 bg-slate-50 rounded-2xl space-y-2">
                            <p className="text-slate-700 font-semibold">
                                Zero to Hero Online and Home Tutoring Services
                            </p>
                            <p className="text-slate-600">
                                9/13, Gandhi Rd, Periyar Nagar, Nehru Nagar West, Coimbatore, Tamil
                                Nadu 641014
                            </p>
                            <p className="text-slate-600">Email: reachus@ztoh.org</p>
                            <p className="text-slate-600">Phone: +91 95643 21000</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
