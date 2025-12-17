"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Zap, Award } from "lucide-react";
import { useJoinUsModal } from "@/components/providers/ModalProvider";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export default function Hero() {
    const { openJoinUsModal } = useJoinUsModal();

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50 selection:bg-secondary/30">

            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 blur-[120px] animate-pulse-slow" />
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-accent/10 to-secondary/10 blur-[100px] animate-float" />
                <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Content */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 text-center lg:text-left"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8 hover:scale-105 transition-transform cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                            </span>
                            Accepting New Students for 2025
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-slate-900 leading-[1.1] mb-6 tracking-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Zero</span> to{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Hero</span>
                                <span className="absolute -bottom-2 left-0 w-full h-3 bg-secondary/20 -skew-x-12 -z-0" />
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Unlock your full potential with our expert-led mentorship and personalized tutoring. We bridge the gap between where you are and where you want to be.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                            <button
                                onClick={openJoinUsModal}
                                className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl overflow-hidden shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Join Us <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex items-center justify-center lg:justify-start gap-8 text-sm font-semibold text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-green-100 text-green-600">
                                    <CheckCircle size={16} />
                                </div>
                                <span>Expert Mentors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                                    <Zap size={16} />
                                </div>
                                <span>Proven Curriculum</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-amber-100 text-amber-600">
                                    <Award size={16} />
                                </div>
                                <span>Lifetime Access</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                        className="flex-1 w-full max-w-lg lg:max-w-none relative perspective-1000"
                    >
                        <div className="relative z-10 bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/50 border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-slate-800">
                                    {/* Abstract Shapes inside card */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-xl"
                                    >
                                        <Sparkles className="text-secondary w-12 h-12" />
                                    </motion.div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                                        Thinking is the Capital
                                    </h3>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                        Enterprise is the Way
                                    </h3>
                                    <p className="text-slate-400 text-center text-sm max-w-[200px]">
                                        Hard Work is the solution.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -top-8 -right-8 z-20 hidden md:block"
                        >
                            <div className="glass p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Success Rate</div>
                                    <div className="text-lg font-bold text-slate-800">100%</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-8 -left-8 z-20 hidden md:block"
                        >
                            <div className="glass p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fast Track</div>
                                    <div className="text-lg font-bold text-slate-800">Growth</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
