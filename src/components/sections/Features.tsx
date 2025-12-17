"use client";

import { CheckCircle2, Star, Users, ArrowRight } from "lucide-react";
import ScrollAnimation from "@/components/animations/ScrollAnimation";

const whyChooseUs = [
    "We firmly believe in the saying, 'The method of teaching and learning determines a student's knowledge and skills, not just their grades.'",
    "Our approach encourages students to remain calm, confident, trust themselves, and stay focused.",
    "We prioritize understanding concepts rather than rote memorization.",
    "We provide highly qualified teachers who are easily accessible through your doorstep or gadgets.",
    "We emphasis on practical knowledge and thorough training.",
    "We offer an updated and personalized syllabus tailored to individual needs.",
    "We follow a standardized syllabus for similar exams, ensuring consistency and clarity.",
    "Our aim is to insist confidence in students and help them improve their grades."
];

const featuresList = [
    { text: "Online forum" },
    { text: "Question of the Day" },
    {
        text: "Flexible Module Option",
        subtext: ["Register/enroll for specific lessons, chapters, or test series", "Pay only for what you need, not for the entire course"]
    },
    {
        text: "Comprehensive Module Option",
        subtext: ["Join the full module along with the test series"]
    },
    {
        text: "Free Counselling Sessions",
        subtext: ["Available for both parents and students, if needed"]
    }
];

const whoCanJoin = [
    "Those tired of rote learning",
    "Those tired of the general education system",
    "Those expecting teachers who can teach at their level of understanding",
    "Those eager to learn by understanding patterns",
    "Those unable to afford expensive fees",
    "Those seeking higher education in their preferred language, Tamil or English",
    "Those searching for someone to explain a book or material in a simple and easier way"
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-3xl" />
                <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <ScrollAnimation>
                        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-secondary">
                            Why We Are Different
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.1}>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ZTOH</span>?
                        </h2>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.2}>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We provide a comprehensive ecosystem for learning and growth. Here is what makes us different.
                        </p>
                    </ScrollAnimation>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Why Choose Us */}
                    <ScrollAnimation
                        delay={0.2}
                        className="h-full"
                    >
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                    <Star size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Why Choose Us</h3>
                            </div>
                            <ul className="space-y-5">
                                {whyChooseUs.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollAnimation>

                    {/* Features (Center Highlight) */}
                    <ScrollAnimation
                        delay={0.3}
                        className="h-full"
                    >
                        <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden transform lg:-translate-y-6 lg:scale-105 z-10 h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-slate-800" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-secondary shadow-inner border border-white/10">
                                        <CheckCircle2 size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Key Features</h3>
                                </div>
                                <ul className="space-y-8">
                                    {featuresList.map((item, index) => (
                                        <li key={index} className="text-slate-300 text-sm leading-relaxed">
                                            <div className="flex items-center gap-3 mb-2 font-bold text-white text-base">
                                                <div className="w-2 h-2 rounded-full bg-secondary shrink-0 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                                {item.text}
                                            </div>
                                            {item.subtext && (
                                                <ul className="pl-5 space-y-2 mt-2 border-l border-white/10 ml-1">
                                                    {item.subtext.map((sub, idx) => (
                                                        <li key={idx} className="text-slate-400 text-xs flex items-center gap-2">
                                                            <ArrowRight size={10} className="text-secondary/50" />
                                                            {sub}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Who Can Join */}
                    <ScrollAnimation
                        delay={0.2}
                        className="h-full"
                    >
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
                                    <Users size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Who Can Join</h3>
                            </div>
                            <ul className="space-y-5">
                                {whoCanJoin.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollAnimation>

                </div>
            </div>
        </section>
    );
}
