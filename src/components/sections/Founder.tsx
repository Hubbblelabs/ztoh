"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Target, Eye } from "lucide-react";

export default function Founder() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/3 relative lg:sticky lg:top-24"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/muthukumar.jpg"
                                alt="MuthuKumar - Founder"
                                width={500}
                                height={600}
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 to-transparent p-8 pt-24">
                                <h3 className="text-2xl font-bold text-white font-heading">MuthuKumar</h3>
                                <p className="text-secondary font-medium">Founder & Head</p>
                            </div>
                        </div>

                        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <Quote className="text-secondary mb-4 w-8 h-8" />
                            <p className="text-slate-700 italic font-medium leading-relaxed">
                                "Confidence and Hard work is the best medicine to kill the disease called Failure"
                            </p>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <div className="w-full lg:w-2/3 space-y-12">

                        {/* Bio */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">
                                Meet the <span className="text-primary">Founder</span>
                            </h2>
                            <div className="prose prose-lg text-slate-600 leading-relaxed">
                                <p>
                                    Hi, This is <span className="font-bold text-slate-900">MuthuKumar</span>, the Founder and Head of "Zero to Hero Online and Home Tutoring Services", Coimbatore. I hold a Master of Philosophy degree in Mathematics and possess extensive experience in teaching mathematics to engineering graduates and students from various school boards, including IB, IGCSE, CBSE, and the State Board of the Indian curriculum.
                                </p>
                                <p className="mt-4">
                                    I have gained valuable expertise in teaching the syllabi of different countries such as the US, the UK, and Saudi Arabia too. Also, I am well-versed in preparing students and trainers for competitive exams such as SSAT (Middle and Upper Level), SSC, IIT-JEE Mains, SAT, GATE, Management (MAT, CAT, TANCET), as well as Deemed Universities Engineering Entrance Exams.
                                </p>
                            </div>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Eye size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
                            </div>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0"></span>
                                    Revolutionize the education system by focusing on understanding, personalized learning, and practical application.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0"></span>
                                    Create a dynamic learning environment that ignites curiosity and passion.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0"></span>
                                    Move away from rote memorization and cultivate a deep understanding of subjects.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0"></span>
                                    Employ skilled teachers who encourage critical thinking and practical skills for student development.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0"></span>
                                    Foster holistic learning to equip students for success in a rapidly changing world.
                                </li>
                            </ul>
                        </motion.div>

                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                    <Target size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0"></span>
                                    Make education affordable and accessible to everyone.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0"></span>
                                    Foster interest in subjects through real-life application-based teaching methods.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0"></span>
                                    Ensure equal educational opportunities to all individuals.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0"></span>
                                    Deliver high-quality teachers directly to your location or through device.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0"></span>
                                    Offer a standardized syllabus for similar exams.
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 shrink-0"></span>
                                    Boost confidence and improve academic grades.
                                </li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
