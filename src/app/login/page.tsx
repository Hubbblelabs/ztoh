'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowRight, GraduationCap } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            const role = (session?.user as any).role;
            if (role === 'admin') router.push('/admin');
            else if (role === 'staff') router.push('/staff');
            else if (role === 'student') router.push('/student/dashboard');
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid credentials');
            } else {
                // Redirect handled by useEffect
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen flex bg-slate-100">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">Zero to Hero</span>
                    </div>
                    <p className="text-slate-400 text-sm ml-15">Education Management System</p>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                            Empowering Education,<br />One Step at a Time
                        </h2>
                        <p className="text-slate-400 text-lg max-w-md">
                            Streamlined management for administrators and staff. Track progress, manage hours, and generate reports effortlessly.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-slate-500 text-sm">
                        © 2025 Zero to Hero. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">Zero to Hero</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
                            <p className="text-slate-500">Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="email" className="mb-2 block">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="mb-2 block">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                                >
                                    <p className="text-red-600 text-sm text-center">{error}</p>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-slate-400 text-sm mt-6 lg:hidden">
                        © 2025 Zero to Hero. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
