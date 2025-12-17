"use client";

import ScrollAnimation from "@/components/animations/ScrollAnimation";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useToast } from "@/components/providers/ToastProvider";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [token, setToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const { addToast } = useToast();

    // Email Verification State
    const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'sent' | 'verified'>('unverified');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
        if (e.target.id === 'email') {
            setVerificationStatus('unverified');
            setVerificationMessage('');
        }
    };

    const handleSendCode = async () => {
        if (!formData.email) {
            setVerificationMessage('Please enter an email address');
            return;
        }
        setIsVerifying(true);
        setVerificationMessage('');
        try {
            const res = await fetch('/api/verify/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setVerificationStatus('sent');
                setVerificationMessage('Verification code sent to your email');
            } else {
                setVerificationMessage(data.error || 'Failed to send code');
            }
        } catch (error) {
            setVerificationMessage('Failed to send code');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            setVerificationMessage('Please enter the code');
            return;
        }
        setIsVerifying(true);
        setVerificationMessage('');
        try {
            const res = await fetch('/api/verify/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email.trim(), code: verificationCode.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setVerificationStatus('verified');
                setVerificationMessage('Email verified successfully');
            } else {
                setVerificationMessage(data.error || 'Invalid code');
            }
        } catch (error) {
            setVerificationMessage('Failed to verify code');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            addToast("Please complete the captcha", "error");
            return;
        }

        if (verificationStatus !== 'verified') {
            addToast("Please verify your email first", "error");
            return;
        }

        setStatus('loading');

        const trimmedData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim()
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...trimmedData, token }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                turnstileRef.current?.reset();
                setToken(null);
                setVerificationStatus('unverified');
                setVerificationCode('');
                setVerificationMessage('');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                const data = await response.json();
                addToast(data.error || "Failed to send message", "error");
                setStatus('error');
                turnstileRef.current?.reset();
                setToken(null);
            }
        } catch (error) {
            setStatus('error');
            addToast("Something went wrong", "error");
            turnstileRef.current?.reset();
            setToken(null);
        }
    };

    return (
        <section id="contact" className="py-24 bg-slate-50 relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <ScrollAnimation>
                            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary">
                                Get In Touch
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Us</span>
                            </h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="text-lg text-slate-600">
                                Get in touch with us for any inquiries or to join our classes.
                            </p>
                        </ScrollAnimation>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info & Map */}
                    <ScrollAnimation className="space-y-8">
                        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow group">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Location</h4>
                                <p className="text-slate-600 text-sm">
                                    9/13 Gandhi Road, Nehru Nagar East, Coimbatore - 641014
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow group">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Email</h4>
                                <p className="text-slate-600 text-sm break-all">
                                    mathsmuthu.j@gmail.com
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow group">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Phone size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Call</h4>
                                <p className="text-slate-600 text-sm">
                                    +91 95643 21000
                                </p>
                            </div>
                        </div>

                        <div className="h-[400px] bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.8484663881104!2d77.0388050748091!3d11.049985689115926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8573b2213579f%3A0xa67911f5d2c7a832!2sZero%20to%20Hero%20Online%20and%20Home%20Tuitions!5e0!3m2!1sen!2sin!4v1684127904510!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '1.5rem' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </ScrollAnimation>

                    {/* Contact Form */}
                    <ScrollAnimation
                        delay={0.2}
                        className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none" />

                        <h3 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">Send Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Enter your name"
                                        required
                                        disabled={status === 'loading'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Your Email</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Enter your email"
                                            required
                                            disabled={status === 'loading' || verificationStatus === 'verified'}
                                        />
                                        {verificationStatus === 'unverified' && (
                                            <button
                                                type="button"
                                                onClick={handleSendCode}
                                                disabled={isVerifying || !formData.email}
                                                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {isVerifying ? 'Sending...' : 'Verify'}
                                            </button>
                                        )}
                                        {verificationStatus === 'verified' && (
                                            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center">
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                    {verificationStatus === 'sent' && (
                                        <div className="mt-2 flex gap-2">
                                            <input
                                                type="text"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                placeholder="Enter 6-digit code"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyCode}
                                                disabled={isVerifying}
                                                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {isVerifying ? 'Checking...' : 'Submit'}
                                            </button>
                                        </div>
                                    )}
                                    {verificationMessage && (
                                        <p className={`text-xs mt-1 ${verificationStatus === 'verified' ? 'text-green-600' : 'text-slate-500'}`}>
                                            {verificationMessage}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                    required
                                    disabled={status === 'loading'}
                                ></textarea>
                            </div>

                            <div className="flex justify-center mb-6">
                                <Turnstile
                                    ref={turnstileRef}
                                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                    onSuccess={setToken}
                                    injectScript={true}
                                    options={{
                                        theme: 'light',
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-gradient-to-r from-primary to-slate-800 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <span className="animate-pulse">Sending...</span>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Message
                                    </>
                                )}
                            </button>
                            {status === 'success' && (
                                <p className="text-green-600 text-center font-medium">Message sent successfully!</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-600 text-center font-medium">Failed to send message. Please try again.</p>
                            )}
                        </form>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
