'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote, Target, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import ScrollAnimation from '@/components/animations/ScrollAnimation';

export default function Founder() {
    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-24">
                    {/* Image Column */}
                    <div className="w-full lg:w-5/12 relative">
                        <ScrollAnimation
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 },
                            }}
                        >
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7, ease: 'easeOut' }}
                                >
                                    <Image
                                        src="/muthukumar.jpg"
                                        alt="MuthuKumar - Founder"
                                        width={600}
                                        height={800}
                                        className="w-full h-auto object-cover aspect-4/5"
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-80 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-1 w-8 bg-secondary rounded-full" />
                                        <p className="text-secondary font-bold tracking-wider uppercase text-sm">
                                            Founder
                                        </p>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white font-heading">
                                        MuthuKumar
                                    </h3>
                                </div>
                            </div>

                            {/* Floating Quote Card */}
                            <motion.div
                                className="absolute -bottom-8 -right-4 md:-right-8 z-20 
                                           glass p-6 rounded-3xl shadow-xl w-72 
                                           animate-float border border-white/60"
                            >
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg text-white">
                                    <Quote size={20} fill="currentColor" />
                                </div>
                                <p className="text-slate-800 font-medium italic text-sm leading-relaxed relative z-10 mt-2">
                                    &quot;Confidence and Hard work is the best medicine to kill the
                                    disease called Failure.&quot;
                                </p>
                            </motion.div>
                        </ScrollAnimation>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-7/12">
                        <ScrollAnimation>
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-sm font-semibold text-primary">
                                <Sparkles size={16} className="text-accent" />
                                <span>About The Visionary</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-8 leading-tight">
                                Meet the{' '}
                                <span className="animated-gradient-text font-extrabold pb-2 inline-block">
                                    Founder
                                </span>
                            </h2>

                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                                <p>
                                    Hi, This is{' '}
                                    <span className="font-bold text-slate-900">MuthuKumar</span>,
                                    the Founder and Head of &quot;Zero to Hero Online and Home
                                    Tutoring Services&quot;, Coimbatore.
                                </p>
                                <p className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <span className="absolute top-0 left-0 w-1 h-full bg-secondary group-hover:bg-primary transition-colors duration-300" />
                                    I hold a Master of Philosophy degree in Mathematics and possess
                                    extensive experience in teaching mathematics to engineering
                                    graduates and students from various school boards, including{' '}
                                    <strong className="text-primary font-bold">
                                        IB, IGCSE, CBSE, and the State Board
                                    </strong>{' '}
                                    of the Indian curriculum.
                                </p>
                                <p>
                                    I have gained valuable expertise in teaching the syllabi of
                                    different countries such as the US, the UK, and Saudi Arabia.
                                    Also, I am well-versed in preparing students for competitive
                                    exams such as SSAT (Middle and Upper Level), SSC, IIT-JEE Mains,
                                    SAT, GATE, Management (MAT, CAT, TANCET), as well as Deemed
                                    Universities Engineering Entrance Exams.
                                </p>
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>

                {/* Vision & Mission Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vision */}
                    <ScrollAnimation delay={0.1}>
                        <div className="h-full bg-white p-8 md:p-10 rounded-4xl shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:border-secondary/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full opacity-50 group-hover:bg-blue-100 transition-colors" />

                            <div className="flex items-center gap-5 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <Eye size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold font-heading text-slate-900 group-hover:text-blue-600 transition-colors">
                                        Our Vision
                                    </h3>
                                </div>
                            </div>

                            <ul className="space-y-4 text-slate-600 relative z-10">
                                {[
                                    'Revolutionize the education system by focusing on understanding, personalized learning, and practical application.',
                                    'Create a dynamic learning environment that ignites curiosity and passion.',
                                    'Move away from rote memorization and cultivate a deep understanding of subjects.',
                                    'Employ skilled teachers who encourage critical thinking and practical skills for student development.',
                                    'Foster holistic learning to equip students for success in a rapidly changing world.',
                                ].map((item, index) => (
                                    <li key={index} className="flex gap-4">
                                        <CheckCircle2 className="w-6 h-6 shrink-0 text-blue-500 bg-white" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollAnimation>

                    {/* Mission */}
                    <ScrollAnimation
                        delay={0.2}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <div className="h-full bg-slate-900 p-8 md:p-10 rounded-4xl shadow-xl shadow-slate-900/20 border border-slate-800 relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full opacity-50 group-hover:bg-accent/10 transition-colors" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

                            <div className="flex items-center gap-5 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-accent shadow-inner backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                                    <Target size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold font-heading text-white group-hover:text-accent transition-colors">
                                        Our Mission
                                    </h3>
                                </div>
                            </div>

                            <div className="text-slate-300 relative z-10 flex flex-col gap-4">
                                {[
                                    'Make education affordable and accessible to everyone with equal opportunities.',
                                    'Offer a standardized syllabus for similar exams across varying regions.',
                                    'Foster interest in subjects through real-life application-based teaching methods.',
                                    'Deliver high-quality teachers directly to your location or through device anywhere.',
                                    'Boost student confidence and improve academic grades dramatically.',
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
                                    >
                                        <Target className="w-6 h-6 shrink-0 text-accent opacity-80 mt-0.5" />
                                        <span className="leading-relaxed text-sm lg:text-base">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
