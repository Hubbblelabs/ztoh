"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, Sparkles, GraduationCap, Users } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { Input } from "@/components/ui/input";
import { FloatingLabelInput, FloatingLabelTextarea } from "@/components/ui/floating-label-input";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface JoinUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

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
    const [attachments, setAttachments] = useState<{ name: string; content: string; type: string }[]>([]);

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
            setAttachments([]);
        }
    }, [isOpen]);

    const handleSelectChange = (name: string, value: string) => {
        setSelectValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newAttachments: { name: string; content: string; type: string }[] = [];
        const MAX_SIZE = 3 * 1024 * 1024; // 3MB

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > MAX_SIZE) {
                setError(`File ${file.name} exceeds 3MB limit`);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise<void>((resolve) => {
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        newAttachments.push({
                            name: file.name,
                            content: reader.result as string,
                            type: file.type
                        });
                    }
                    resolve();
                };
            });
        }
        setAttachments(prev => [...prev, ...newAttachments]);
        setError("");
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
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
                body: JSON.stringify({ ...data, email, type: activeTab, token, attachments }),
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setVerificationMessage('Please enter a valid email address');
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
                        className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        key="sheet"
                        initial={{ x: "100%", opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0.5 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl overflow-y-auto"
                    >
                        {/* Decorative Header Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary" style={{ backgroundSize: '200% 100%', animation: 'gradient-flow 3s ease infinite' }} />

                        <div className="p-6 md:p-8 relative">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between mb-8"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-secondary/20">
                                        <Sparkles className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Join Us</h2>
                                        <p className="text-sm text-slate-500">Start your journey today</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:rotate-90 group"
                                >
                                    <X size={20} className="text-slate-500 group-hover:text-slate-700 transition-colors" />
                                </button>
                            </motion.div>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.1, damping: 10, stiffness: 200 }}
                                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                                    >
                                        <CheckCircle size={40} className="text-white" />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl font-bold text-slate-900 mb-3"
                                    >
                                        Request Submitted!
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-slate-600 mb-8 max-w-sm"
                                    >
                                        Thank you for your interest. Our team will get back to you shortly.
                                    </motion.p>
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        onClick={onClose}
                                        className="px-8 py-3 bg-gradient-to-r from-primary to-slate-800 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Close
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Modern Tabs */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl mb-8 border border-slate-200/50"
                                    >
                                        <motion.div
                                            className="absolute inset-y-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-lg"
                                            initial={false}
                                            animate={{
                                                left: activeTab === "student" ? "6px" : "50%",
                                            }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("student")}
                                            className={`relative flex-1 py-3.5 text-sm font-semibold rounded-xl transition-colors duration-200 z-10 flex items-center justify-center gap-2 ${activeTab === "student" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <GraduationCap size={18} />
                                            Student
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("teacher")}
                                            className={`relative flex-1 py-3.5 text-sm font-semibold rounded-xl transition-colors duration-200 z-10 flex items-center justify-center gap-2 ${activeTab === "teacher" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <Users size={18} />
                                            Teacher
                                        </button>
                                    </motion.div>

                                    {/* Removed old tabs and form wrapper */}
                                    <form onSubmit={handleSubmit}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeTab}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-5"
                                            >
                                                {/* Common Fields */}
                                                <div className="space-y-5">
                                                    <FloatingLabelInput
                                                        id="name"
                                                        required
                                                        name="name"
                                                        type="text"
                                                        label="Name"
                                                    />

                                                    <div className="flex gap-2">
                                                        <div className={`flex h-12 flex-1 items-center rounded-md border px-3 transition-colors focus-within:ring-2 focus-within:ring-zinc-200 dark:focus-within:ring-zinc-500 focus-within:border-zinc-400 dark:focus-within:border-zinc-400 ${verificationStatus === 'verified' ? 'bg-green-50/50 border-green-200' : 'border-zinc-300 dark:border-zinc-700 bg-background'}`}>
                                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap flex items-center mr-1 select-none pointer-events-none">
                                                                Email
                                                                <span className="mx-1">:</span>
                                                            </label>
                                                            <input
                                                                id="email"
                                                                required
                                                                name="email"
                                                                type="email"
                                                                value={email}
                                                                onChange={handleEmailChange}
                                                                className="flex-1 bg-transparent py-2 text-base text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                                disabled={verificationStatus === 'verified'}
                                                            />
                                                        </div>
                                                        {verificationStatus === 'unverified' && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                type="button"
                                                                onClick={handleSendCode}
                                                                disabled={isVerifying || !email}
                                                                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold disabled:opacity-50 whitespace-nowrap transition-all duration-200 shadow-md hover:shadow-lg"
                                                            >
                                                                {isVerifying ? (
                                                                    <Loader2 className="animate-spin" size={18} />
                                                                ) : 'Verify'}
                                                            </motion.button>
                                                        )}
                                                        {verificationStatus === 'verified' && (
                                                            <motion.div
                                                                initial={{ scale: 0, rotate: -45 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                className="px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-md text-sm font-semibold flex items-center gap-2 shadow-md"
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
                                                                className="flex gap-2 overflow-hidden"
                                                            >
                                                                <Input
                                                                    type="text"
                                                                    value={verificationCode}
                                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                                    className="font-mono tracking-widest text-center"
                                                                    placeholder="Enter 6-digit code"
                                                                    maxLength={6}
                                                                />
                                                                <motion.button
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    type="button"
                                                                    onClick={handleVerifyCode}
                                                                    disabled={isVerifying}
                                                                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold hover:shadow-lg disabled:opacity-50 whitespace-nowrap transition-all duration-200"
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

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <CustomSelect
                                                            label="Gender"
                                                            required
                                                            name="gender"
                                                            value={selectValues.gender}
                                                            onChange={(val) => handleSelectChange("gender", val)}
                                                            options={[
                                                                { value: "male", label: "Male" },
                                                                { value: "female", label: "Female" }
                                                            ]}
                                                        />
                                                        <FloatingLabelInput
                                                            id="mobile"
                                                            required
                                                            name="mobile"
                                                            type="tel"
                                                            label="Mobile Number"
                                                        />
                                                    </div>

                                                    <FloatingLabelTextarea
                                                        id="address"
                                                        required
                                                        name="address"
                                                        rows={3}
                                                        label="Address"
                                                    />
                                                </div>

                                                {/* Student Specific Fields */}
                                                <AnimatePresence mode="wait">
                                                    {activeTab === "student" && (
                                                        <motion.div
                                                            key="student-fields"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="space-y-5 pt-5 border-t border-slate-100"
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                                                <span className="text-sm font-semibold text-slate-500">Student Information</span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                                <FloatingLabelInput
                                                                    id="gradeYear"
                                                                    required
                                                                    name="gradeYear"
                                                                    type="text"
                                                                    label="Grade / Year"
                                                                />
                                                                <FloatingLabelInput
                                                                    id="boardUniversity"
                                                                    required
                                                                    name="boardUniversity"
                                                                    type="text"
                                                                    label="Board / University"
                                                                />
                                                            </div>

                                                            <FloatingLabelInput
                                                                id="subjectDetails"
                                                                required
                                                                name="subjectDetails"
                                                                type="text"
                                                                label="Subject Details"
                                                            />

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

                                                            <FloatingLabelTextarea
                                                                id="specificNeeds"
                                                                name="specificNeeds"
                                                                rows={2}
                                                                label="Specific Needs"
                                                            />
                                                        </motion.div>
                                                    )}

                                                    {/* Teacher Specific Fields */}
                                                    {activeTab === "teacher" && (
                                                        <motion.div
                                                            key="teacher-fields"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="space-y-5 pt-5 border-t border-slate-100"
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                                <span className="text-sm font-semibold text-slate-500">Teacher Information</span>
                                                            </div>

                                                            <FloatingLabelInput
                                                                id="qualification"
                                                                required
                                                                name="qualification"
                                                                type="text"
                                                                label="Qualification"
                                                            />

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                                <FloatingLabelInput
                                                                    id="nationality"
                                                                    required
                                                                    name="nationality"
                                                                    type="text"
                                                                    label="Nationality"
                                                                />
                                                                <FloatingLabelInput
                                                                    id="state"
                                                                    required
                                                                    name="state"
                                                                    type="text"
                                                                    label="State"
                                                                />
                                                            </div>

                                                            <FloatingLabelInput
                                                                id="city"
                                                                required
                                                                name="city"
                                                                type="text"
                                                                label="City"
                                                            />

                                                            <FloatingLabelInput
                                                                id="currentJobDetails"
                                                                required
                                                                name="currentJobDetails"
                                                                type="text"
                                                                label="Current Job Details"
                                                            />

                                                            <FloatingLabelInput
                                                                id="experience"
                                                                required
                                                                name="experience"
                                                                type="text"
                                                                label="Experience"
                                                            />

                                                            <FloatingLabelInput
                                                                id="subjectWillingToHandle"
                                                                required
                                                                name="subjectWillingToHandle"
                                                                type="text"
                                                                label="Subject Willing to Handle"
                                                            />

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                                                            <div>
                                                                <div className="relative">
                                                                    <input
                                                                        type="file"
                                                                        onChange={handleFileChange}
                                                                        className="hidden"
                                                                        id="file-upload"
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    />
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${attachments.length > 0 ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-slate-400'
                                                                            }`}
                                                                    >
                                                                        <div className="text-center">
                                                                            <p className="text-sm font-medium text-slate-600">
                                                                                {attachments.length > 0
                                                                                    ? `${attachments.length} file(s) selected`
                                                                                    : "Resume / CV (Optional) - Click to upload"}
                                                                            </p>
                                                                            <p className="text-xs text-slate-400 mt-1">
                                                                                PDF, DOC, Images (Max 3MB)
                                                                            </p>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                                {attachments.length > 0 && (
                                                                    <div className="mt-3 space-y-2">
                                                                        {attachments.map((file, index) => (
                                                                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                                                <span className="text-sm text-slate-600 truncate max-w-[200px]">{file.name}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeAttachment(index)}
                                                                                    className="text-red-500 hover:text-red-600 p-1"
                                                                                >
                                                                                    <X size={16} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Error Message */}
                                                <AnimatePresence>
                                                    {error && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                                            className="text-red-500 text-sm text-center bg-red-50 border border-red-100 p-4 rounded-xl"
                                                        >
                                                            {error}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Turnstile */}
                                                <motion.div variants={itemVariants} className="flex justify-center pt-2">
                                                    <Turnstile
                                                        ref={turnstileRef}
                                                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                                        onSuccess={setToken}
                                                        injectScript={true}
                                                        options={{
                                                            theme: 'light',
                                                        }}
                                                    />
                                                </motion.div>

                                                {/* Submit Button */}
                                                <motion.button
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01, y: -2 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="w-full py-4 bg-gradient-to-r from-primary via-slate-800 to-primary text-white font-bold text-lg rounded-md shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden btn-shine"
                                                    style={{ backgroundSize: '200% 100%' }}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={22} />
                                                            <span>Submitting...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles size={20} />
                                                            <span>Submit Request</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </motion.div>
                                        </AnimatePresence>
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
