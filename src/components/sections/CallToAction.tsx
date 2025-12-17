"use client";

import Link from "next/link";
import ScrollAnimation from "@/components/animations/ScrollAnimation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useJoinUsModal } from "@/components/providers/ModalProvider";

export default function CallToAction() {
    const { openJoinUsModal } = useJoinUsModal();
    return (
        <section id="cta" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <ScrollAnimation
                    className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary via-slate-900 to-slate-800 px-6 py-20 md:px-20 md:py-24 text-center shadow-2xl"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(45,212,191,0.15),_transparent_50%)]" />
                        <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[80%] rounded-full bg-secondary/10 blur-[100px]" />
                        <div className="absolute bottom-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[100px]" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <ScrollAnimation>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-secondary font-semibold mb-8">
                                <Sparkles size={16} />
                                <span>Start Your Journey Today</span>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.1}>
                            <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-8 leading-tight">
                                Ready to Transform Your <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Academic Future?</span>
                            </h2>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.2}>
                            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of students who have already taken the leap with Zero to Hero. Expert guidance, personalized learning, and proven results await.
                            </p>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.3}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={openJoinUsModal}
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    Get Started Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </ScrollAnimation>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
