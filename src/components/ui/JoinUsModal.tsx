"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface JoinUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinUsModal({ isOpen, onClose }: JoinUsModalProps) {
    const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    // Email Verification State
    const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'sent' | 'verified'>('unverified');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [email, setEmail] = useState('');

    // Form State for Selects
    const [selectValues, setSelectValues] = useState({
        gender: "",
        applyingAs: "",
        currentStatus: "",
        modeOfStudy: "",
        modeOfTutoring: "",
        workType: ""
    });

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            setError("");
            setSelectValues({
                gender: "",
                applyingAs: "",
                currentStatus: "",
                modeOfStudy: "",
                modeOfTutoring: "",
                workType: ""
            });
            setToken(null);
            if (turnstileRef.current) {
                turnstileRef.current.reset();
            }
            setVerificationStatus('unverified');
            setVerificationCode('');
            setVerificationMessage('');
            setEmail('');
        }
    }, [isOpen]);

    const handleSelectChange = (name: string, value: string) => {
        setSelectValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setError("Please complete the captcha");
            return;
        }

        if (verificationStatus !== 'verified') {
            setError("Please verify your email first");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData.entries());

        // Trim all string values
        const data: Record<string, any> = {};
        for (const [key, value] of Object.entries(rawData)) {
            if (typeof value === 'string') {
                data[key] = value.trim();
            } else {
                data[key] = value;
            }
        }

        try {
            const response = await fetch("/api/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, email, type: activeTab, token }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to submit request");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            turnstileRef.current?.reset();
            setToken(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendCode = async () => {
        if (!email) {
            setVerificationMessage('Please enter an email address');
            return;
        }
        setIsVerifying(true);
        setVerificationMessage('');
        try {
            const res = await fetch('/api/verify/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
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
                body: JSON.stringify({ email: email.trim(), code: verificationCode.trim() }),
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

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setVerificationStatus('unverified');
        setVerificationMessage('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        key="sheet"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl overflow-y-auto"
                    >
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Join Us</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <X size={24} className="text-slate-500" />
                                </button>
                            </div>

                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
                                    <p className="text-slate-600 mb-8">
                                        Thank you for your interest. We will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Tabs */}
                                    <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
                                        <button
                                            onClick={() => setActiveTab("student")}
                                            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === "student"
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            Student
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("teacher")}
                                            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === "teacher"
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            Teacher
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Common Fields */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                                                <input required name="name" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter your full name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                                                <div className="flex gap-2">
                                                    <input
                                                        required
                                                        name="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                        placeholder="Enter your email address"
                                                        disabled={verificationStatus === 'verified'}
                                                    />
                                                    {verificationStatus === 'unverified' && (
                                                        <button
                                                            type="button"
                                                            onClick={handleSendCode}
                                                            disabled={isVerifying || !email}
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <CustomSelect
                                                    label="Gender"
                                                    required
                                                    name="gender"
                                                    value={selectValues.gender}
                                                    onChange={(val) => handleSelectChange("gender", val)}
                                                    options={[
                                                        { value: "male", label: "Male" },
                                                        { value: "female", label: "Female" },
                                                        { value: "other", label: "Other" }
                                                    ]}
                                                />
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                                    <input required name="mobile" type="tel" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter mobile number" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Address <span className="text-red-500">*</span></label>
                                                <textarea required name="address" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter your full address" />
                                            </div>
                                        </div>

                                        {/* Student Specific Fields */}
                                        {activeTab === "student" && (
                                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <CustomSelect
                                                        label="Applying As"
                                                        required
                                                        name="applyingAs"
                                                        value={selectValues.applyingAs}
                                                        onChange={(val) => handleSelectChange("applyingAs", val)}
                                                        options={[
                                                            { value: "student", label: "Student" },
                                                            { value: "parent", label: "Parent" },
                                                            { value: "other", label: "Other" }
                                                        ]}
                                                    />
                                                    <CustomSelect
                                                        label="Current Status"
                                                        required
                                                        name="currentStatus"
                                                        value={selectValues.currentStatus}
                                                        onChange={(val) => handleSelectChange("currentStatus", val)}
                                                        options={[
                                                            { value: "school", label: "School" },
                                                            { value: "college", label: "College" },
                                                            { value: "other", label: "Other" }
                                                        ]}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Grade / Year <span className="text-red-500">*</span></label>
                                                        <input required name="gradeYear" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 10th Grade" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Board / University <span className="text-red-500">*</span></label>
                                                        <input required name="boardUniversity" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. CBSE" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject Details <span className="text-red-500">*</span></label>
                                                    <input required name="subjectDetails" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Subjects you need help with" />
                                                </div>
                                                <CustomSelect
                                                    label="Mode of Study"
                                                    required
                                                    name="modeOfStudy"
                                                    value={selectValues.modeOfStudy}
                                                    onChange={(val) => handleSelectChange("modeOfStudy", val)}
                                                    options={[
                                                        { value: "online", label: "Online" },
                                                        { value: "home_tuition", label: "Home Tuition" },
                                                        { value: "1_on_1", label: "1-1" },
                                                        { value: "group", label: "Group" }
                                                    ]}
                                                />
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Specific Needs</label>
                                                    <textarea name="specificNeeds" placeholder="Female tutor, Tamil known, Crash course, etc." rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Teacher Specific Fields */}
                                        {activeTab === "teacher" && (
                                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Qualification <span className="text-red-500">*</span></label>
                                                    <input required name="qualification" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. M.Sc Mathematics" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nationality <span className="text-red-500">*</span></label>
                                                        <input required name="nationality" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">State <span className="text-red-500">*</span></label>
                                                        <input required name="state" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">City <span className="text-red-500">*</span></label>
                                                    <input required name="city" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Job Details <span className="text-red-500">*</span></label>
                                                    <input required name="currentJobDetails" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Current role and organization" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience <span className="text-red-500">*</span></label>
                                                    <input required name="experience" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Years of experience" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject Willing to Handle <span className="text-red-500">*</span></label>
                                                    <input required name="subjectWillingToHandle" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <CustomSelect
                                                        label="Mode of Tutoring"
                                                        required
                                                        name="modeOfTutoring"
                                                        value={selectValues.modeOfTutoring}
                                                        onChange={(val) => handleSelectChange("modeOfTutoring", val)}
                                                        options={[
                                                            { value: "online", label: "Online" },
                                                            { value: "home_tuition", label: "Home Tuition" },
                                                            { value: "1_on_1", label: "1-1" },
                                                            { value: "group_class", label: "Group Class" }
                                                        ]}
                                                    />
                                                    <CustomSelect
                                                        label="Work Type"
                                                        required
                                                        name="workType"
                                                        value={selectValues.workType}
                                                        onChange={(val) => handleSelectChange("workType", val)}
                                                        options={[
                                                            { value: "full_time", label: "Full Time" },
                                                            { value: "part_time", label: "Part Time" }
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
                                        )}

                                        <div className="flex justify-center">
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
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Request"
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
