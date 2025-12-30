"use client";

import ScrollAnimation from "@/components/animations/ScrollAnimation";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import { useJoinUsModal } from "@/components/providers/ModalProvider";
import { motion } from "framer-motion";

export default function CallToAction() {
    const { openJoinUsModal } = useJoinUsModal();
    return (
        <section id="cta" className="py-28 relative overflow-hidden bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <ScrollAnimation
                    className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary via-slate-900 to-slate-800 px-6 py-10 md:px-20 md:py-16 text-center shadow-2xl"
                >
                    {/* Enhanced Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(14,165,233,0.2),_transparent_50%)]" />
                        <div className="absolute -top-[40%] -right-[15%] w-[70%] h-[70%] rounded-full bg-secondary/15 blur-[100px] animate-pulse-slow" />
                        <div className="absolute bottom-[10%] -left-[15%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[100px]" />

                        {/* Floating Particles */}
                        <motion.div
                            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] left-[15%] w-3 h-3 rounded-full bg-secondary/50"
                        />
                        <motion.div
                            animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-[30%] right-[20%] w-2 h-2 rounded-full bg-accent/50"
                        />
                        <motion.div
                            animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute bottom-[30%] left-[25%] w-2 h-2 rounded-full bg-white/30"
                        />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <ScrollAnimation>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-secondary font-semibold mb-8 cursor-default"
                            >
                                <Sparkles size={16} className="animate-pulse" />
                                <span>Start Your Journey Today</span>
                                <Sparkles size={16} className="animate-pulse" />
                            </motion.div>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.1}>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-8 leading-tight">
                                Ready to Transform Your <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary animate-gradient-text" style={{ backgroundSize: '200% auto' }}>
                                    Academic Future?
                                </span>
                            </h2>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.2}>
                            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of students who have already taken the leap with Zero to Hero. Expert guidance, personalized learning, and <span className="text-white font-medium">proven results</span> await.
                            </p>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.3}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={openJoinUsModal}
                                    className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-primary font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Zap size={22} className="text-secondary relative z-10" />
                                    <span className="relative z-10">Get Started Now</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
                                </motion.button>
                            </div>
                        </ScrollAnimation>

                        {/* Trust Indicators */}
                        <ScrollAnimation delay={0.4}>
                            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-white font-medium">
                                                {['A', 'B', 'C', 'D'][i]}
                                            </div>
                                        ))}
                                    </div>
                                    <span>1000+ Students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="ml-1">5.0 Rating</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span>100% Success Rate</span>
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
