"use client";

import ScrollAnimation from "@/components/animations/ScrollAnimation";

export default function About() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">
                            About <span className="text-primary">Us</span>
                        </h2>
                        <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-12 text-lg text-slate-600 leading-relaxed">
                        <ScrollAnimation>
                            <p>
                                Founded in 2015 in Coimbatore, <span className="font-bold text-slate-900">Zero to Hero Online and Home Tutoring Services</span> provides all kinds of educational support for everything from elementary school to competitive exams like JEE, SAT, TANCET, and more. We offer online and in-home tutoring sessions for both one-on-one and group tutoring. We serve all boards, including the IB and IGCSE, with our services. Additionally, we expanded our services to other countries like the US, the UK, the Emirates, and Saudi Arabia. Our team takes the utmost care to ensure that each student receives individualized attention and committed assistance to support their professional advancement and realize their goals Regardless of the student's skill level.
                            </p>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.1}>
                            <div className="relative py-10 px-8 md:px-12 rounded-2xl bg-gradient-to-br from-primary to-slate-900 text-white shadow-xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-20 h-20 bg-secondary/20 rounded-br-full blur-xl"></div>
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent/20 rounded-tl-full blur-xl"></div>

                                <div className="relative z-10 text-center">
                                    <span className="text-6xl text-secondary/30 font-serif absolute -top-4 -left-2">"</span>
                                    <p className="text-xl md:text-2xl font-medium italic leading-relaxed font-heading">
                                        Aim beyond the ordinary, small ambitions are a disservice to your potential. When your aspirations are grand, let your dedication and preparation be even more monumental. In the pursuit of greatness, there is no room for small aims or modest efforts.
                                    </p>
                                    <span className="text-6xl text-secondary/30 font-serif absolute -bottom-8 -right-2">"</span>
                                </div>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation delay={0.2}>
                            <p>
                                We rely on effective syllabus management, by breaking down the syllabus into manageable parts and assigning specific timelines for each chapter. Shorter tasks with realistic deadlines and a structured study routine will minimize procrastination and stress. This strategy also helps you to plan the pace at which you need to complete each section, ensuring you manage your time effectively during the examination it relieves some of the frustration that comes with having all the answers but not enough time.
                            </p>
                        </ScrollAnimation>
                    </div>
                </div>
            </div>
        </section>
    );
}
