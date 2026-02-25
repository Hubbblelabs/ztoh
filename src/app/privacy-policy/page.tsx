import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Zero to Hero',
    description:
        'Privacy Policy for Zero to Hero Online and Home Tutoring Services. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
    return (
        <section className="py-24 md:py-32 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12 space-y-10">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            At Zero to Hero Online and Home Tutoring Services, we collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Personal identification information (name, email address, phone number)</li>
                            <li>Educational background and current academic level</li>
                            <li>Course preferences and learning goals</li>
                            <li>Payment and billing information</li>
                            <li>Communication records between you and our tutors</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Provide, maintain, and improve our tutoring services</li>
                            <li>Match you with appropriate tutors and courses</li>
                            <li>Process payments and send related information</li>
                            <li>Send you technical notices, updates, and administrative messages</li>
                            <li>Respond to your comments, questions, and customer service requests</li>
                            <li>Monitor and analyse trends, usage, and activities</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            3. Information Sharing
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, provided those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect our or others&apos; rights, property, or safety.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            4. Cookies &amp; Tracking Technologies
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some parts of our website may not function properly without cookies.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            5. Data Security
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            6. Your Rights
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate or incomplete data</li>
                            <li>Request deletion of your personal information</li>
                            <li>Object to or restrict processing of your personal data</li>
                            <li>Withdraw consent at any time where we rely on consent to process your data</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            7. Children&apos;s Privacy
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Our services are designed for students of all ages. For students under 18, we require parental or guardian consent before collecting personal information. Parents and guardians can review, update, or delete their child&apos;s information by contacting us directly.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            8. Changes to This Policy
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top. You are advised to review this page periodically for any changes.
                        </p>
                    </div>

                    <div className="border-t border-slate-200 pt-8">
                        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">
                            9. Contact Us
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-4 p-6 bg-slate-50 rounded-2xl space-y-2">
                            <p className="text-slate-700 font-semibold">Zero to Hero Online and Home Tutoring Services</p>
                            <p className="text-slate-600">9/13, Gandhi Rd, Periyar Nagar, Nehru Nagar West, Coimbatore, Tamil Nadu 641014</p>
                            <p className="text-slate-600">Email: reachus@ztoh.org</p>
                            <p className="text-slate-600">Phone: +91 95643 21000</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
