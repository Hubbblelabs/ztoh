"use client";

import ScrollAnimation from "@/components/animations/ScrollAnimation";
import { MapPin, Mail, Phone, Send, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

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

    const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-slate-200/80 bg-white/90 backdrop-blur-sm focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all duration-300 hover:border-slate-300 hover:shadow-sm placeholder:text-slate-400 text-slate-800";

    return (
        <section id="contact" className="pt-6 pb-12 bg-white border-t border-slate-200 relative overflow-hidden">
            {/* Enhanced Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-secondary/3 to-accent/3 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <ScrollAnimation>
                        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary backdrop-blur-sm">
                            <Sparkles size={16} className="text-secondary" />
                            Get In Touch
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.1}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 mb-6">
                            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Us</span>
                        </h2>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.2}>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Get in touch with us for any inquiries or to join our classes. We're here to help you succeed.
                        </p>
                    </ScrollAnimation>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Contact Info & Map */}
                    <ScrollAnimation className="space-y-8">
                        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: MapPin, color: 'blue', title: 'Location', text: '9/13 Gandhi Road, Nehru Nagar East, Coimbatore - 641014' },
                                { icon: Mail, color: 'green', title: 'Email', text: 'mathsmuthu.j@gmail.com' },
                                { icon: Phone, color: 'purple', title: 'Call', text: '+91 95643 21000' }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 text-center hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-14 h-14 ${item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                                item.color === 'green' ? 'bg-green-50 text-green-600' :
                                                    'bg-purple-50 text-purple-600'
                                            } rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform`}
                                    >
                                        <item.icon size={24} />
                                    </motion.div>
                                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                                    <p className="text-slate-600 text-sm break-all">
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                            className="h-[400px] bg-white p-3 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.8484663881104!2d77.0388050748091!3d11.049985689115926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8573b2213579f%3A0xa67911f5d2c7a832!2sZero%20to%20Hero%20Online%20and%20Home%20Tuitions!5e0!3m2!1sen!2sin!4v1684127904510!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '1.25rem' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </motion.div>
                    </ScrollAnimation>

                    {/* Contact Form */}
                    <ScrollAnimation delay={0.2}>
                        <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.3 }}
                            className="form-card p-8 md:p-10 relative"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/10 to-accent/5 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-secondary/5 rounded-tr-[80px] -ml-8 -mb-8 pointer-events-none blur-2xl" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/20">
                                        <Send className="text-white" size={18} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Send Message</h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div
                                            whileFocus={{ scale: 1.01 }}
                                            className="space-y-2"
                                        >
                                            <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                                                Your Name <span className="text-secondary">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="Enter your name"
                                                required
                                                disabled={status === 'loading'}
                                            />
                                        </motion.div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                                Your Email <span className="text-secondary">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`${inputClasses} ${verificationStatus === 'verified' ? 'bg-green-50/50 border-green-200' : ''}`}
                                                    placeholder="Enter your email"
                                                    required
                                                    disabled={status === 'loading' || verificationStatus === 'verified'}
                                                />
                                                {verificationStatus === 'unverified' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        type="button"
                                                        onClick={handleSendCode}
                                                        disabled={isVerifying || !formData.email}
                                                        className="px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl text-sm font-semibold hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 whitespace-nowrap transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        {isVerifying ? <Loader2 className="animate-spin" size={18} /> : 'Verify'}
                                                    </motion.button>
                                                )}
                                                {verificationStatus === 'verified' && (
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -45 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        className="px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md"
                                                    >
                                                        <CheckCircle size={16} />
                                                        Verified
                                                    </motion.div>
                                                )}
                                            </div>
                                            <AnimatePresence>
                                                {verificationStatus === 'sent' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-3 flex gap-2 overflow-hidden"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={verificationCode}
                                                            onChange={(e) => setVerificationCode(e.target.value)}
                                                            className={`${inputClasses} font-mono tracking-widest text-center`}
                                                            placeholder="Enter 6-digit code"
                                                            maxLength={6}
                                                        />
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            type="button"
                                                            onClick={handleVerifyCode}
                                                            disabled={isVerifying}
                                                            className="px-5 py-3 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-secondary/20 disabled:opacity-50 whitespace-nowrap transition-all duration-200"
                                                        >
                                                            {isVerifying ? <Loader2 className="animate-spin" size={18} /> : 'Submit'}
                                                        </motion.button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            {verificationMessage && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`text-sm ${verificationStatus === 'verified' ? 'text-green-600' : 'text-slate-500'}`}
                                                >
                                                    {verificationMessage}
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                                            Message <span className="text-secondary">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`${inputClasses} resize-none`}
                                            placeholder="How can we help you?"
                                            required
                                            disabled={status === 'loading'}
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-center py-2">
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

                                    <motion.button
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-4 bg-gradient-to-r from-primary via-slate-800 to-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden btn-shine"
                                        style={{ backgroundSize: '200% 100%' }}
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 className="animate-spin" size={22} />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {status === 'success' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-100 rounded-xl"
                                            >
                                                <CheckCircle className="text-green-600" size={20} />
                                                <span className="text-green-600 font-medium">Message sent successfully!</span>
                                            </motion.div>
                                        )}
                                        {status === 'error' && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-red-600 text-center font-medium p-4 bg-red-50 border border-red-100 rounded-xl"
                                            >
                                                Failed to send message. Please try again.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>
                        </motion.div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
