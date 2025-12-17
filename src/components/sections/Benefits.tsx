"use client";

import { motion } from "framer-motion";
import { Laptop, Home, Check } from "lucide-react";

const onlineBenefits = [
    "Convenient and flexible learning experience.",
    "Ability to save and review lectures at any time.",
    "Encourages self-discipline and fosters interaction.",
    "Global access to education from the comfort of your home.",
    "Eliminates the need for travel to institutes or tutors locations.",
    "Connects students with excellent faculty regardless of distance.",
    "Enables efficient time management for students living far from tutors or institute campuses.",
];

const homeBenefits = [
    "Reduced distractions for focused learning.",
    "Increased individual attention from the instructor.",
    "Equal attention given to every student in the class.",
    "Opportunities for group work and combined study sessions.",
    "Cultivation of a healthy competitive environment among students.",
    "Decreased screen time, promoting a healthier learning environment.",
    "Avoidance of technical issues typically faced in traditional classrooms.",
    "Utilization of manual books and written notes for comprehensive learning.",
];

export default function Benefits() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">
                        Learning <span className="text-primary">Options</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose the mode of learning that fits your lifestyle and goals. We offer both flexible online classes and focused home-based sessions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Online Classes */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Laptop size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Online-based Classes</h3>
                        </div>
                        <ul className="space-y-4">
                            {onlineBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check size={20} className="text-green-500 mt-1 shrink-0" />
                                    <span className="text-slate-600 leading-relaxed">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Home-based Classes */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                                <Home size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Home-based Classes</h3>
                        </div>
                        <ul className="space-y-4">
                            {homeBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check size={20} className="text-green-500 mt-1 shrink-0" />
                                    <span className="text-slate-600 leading-relaxed">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
