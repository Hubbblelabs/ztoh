"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import ScrollAnimation from "@/components/animations/ScrollAnimation";

const faqs = [
    {
        question: "How to enroll in the courses?",
        answer: "You can enroll in the courses by clicking on the join us or get started button."
    },
    {
        question: "Are the demo classes free of cost?",
        answer: "Yes, the demo classes are completely free of cost."
    },
    {
        question: "Can I enroll for only one lesson/chapter/test series?",
        answer: "Yes, you can enroll for a specific part of your choice."
    },
    {
        question: "Can I get study materials alone?",
        answer: "No, study materials are not available separately."
    },
    {
        question: "Will I get a refund in case of discontinuation?",
        answer: "Refund policies are based on the terms and conditions."
    },
    {
        question: "What payment methods are accepted by the institute?",
        answer: "We accept online payments and cash."
    },
    {
        question: "What type of methodology is followed in Zero to Hero Online/Home Tuition?",
        answer: "We follow an application-oriented methodology with a focus on knowledge-based learning."
    },
    {
        question: "Why should I take online lessons?",
        answer: "Online lessons are suitable for those who are looking for distance learning. They save time on traveling and allow students to continue their lessons even when they are away from home."
    },
    {
        question: "What platform is used for online classes?",
        answer: "We conduct online classes through Google Meet."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <ScrollAnimation>
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h2>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.1}>
                        <p className="text-lg text-slate-600">
                            Find answers to common questions about our tutoring services.
                        </p>
                    </ScrollAnimation>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <ScrollAnimation
                            key={index}
                            delay={index * 0.05}
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                                    {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>
                            <motion.div
                                initial={false}
                                animate={{ height: openIndex === index ? "auto" : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}
