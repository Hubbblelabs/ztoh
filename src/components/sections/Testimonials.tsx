"use client";

import ScrollAnimation from "@/components/animations/ScrollAnimation";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "AJAY KRISHNA",
        title: "Student-CBSE 12",
        rating: 5,
        text: "He is a very good teacher. He teaches in an easy & understandable method. His unique method of teaching really helps to solve problems. I scored good marks in my 12th boards — thanks to him."
    },
    {
        name: "SUKESHAN S",
        title: "IGCSE & IB Diploma & JEE",
        rating: 5,
        text: "Awesome tuition. Have been attending for more than 2 years and I’m really grateful for their help and support."
    },
    {
        name: "SUTHIR PRABAKARAN",
        title: "10th,12th & JEE",
        rating: 5,
        text: "One of the best Math professors I have ever seen. Zero to Hero online course helped me score good marks in JEE too. Thank you sir!"
    },
    {
        name: "KAVIPRIYA",
        title: "Engineering Student",
        rating: 5,
        text: "Correct place to develop maths skills. Muthukumar sir is patient, knowledgeable, and explains in a very simple way. Highly recommend him."
    },
    {
        name: "SIBI CHAKRAVARTHI",
        title: "TANCET",
        rating: 5,
        text: "Nice coaching and countless doubt clarification sessions. Best coaching center."
    },
    {
        name: "PRAJWAAL",
        title: "Student-CBSE 12",
        rating: 5,
        text: "I took home tuition for Mathematics for 12th CBSE. It really helped me improve. Zero to Hero is the best tuition in Coimbatore."
    },
    {
        name: "AVANEETH ANAND",
        title: "Student-CBSE 12",
        rating: 5,
        text: "One of the best teachers. Makes complicated problem solving look easy with his techniques. Helped me score excellent marks."
    },
    {
        name: "DHANIKA DENNIS",
        title: "Student-CBSE 10th to 12th",
        rating: 5,
        text: "Success oriented. He is always punctual and helps his students achieve the best."
    },
    {
        name: "K.LAKSIITHA",
        title: "IGCSE & IB Diploma",
        rating: 5,
        text: "The best mathematics classes. Made everything easier to understand."
    },
    {
        name: "SUGAPRIYA",
        title: "",
        rating: 5,
        text: "I arranged tuitions for my cousin from 10th to 12th. Punctual and very good teacher."
    },
    {
        name: "DINESH SANKAR",
        title: "Parent",
        rating: 5,
        text: "Useful tuition. Definitely we reach from Zero to Hero."
    },
    {
        name: "VAISHNAVH",
        title: "Tiruchengode-Stateboard 12th",
        rating: 5,
        text: "Good and fabulous teacher. Easy to become topper in maths. Very useful coaching class 😊😊"
    },
    {
        name: "V M PRIYADHARSHINI",
        title: "Stateboard 10th,12th,TANCET",
        rating: 5,
        text: "Teaching was very good. Easily understood difficult concepts with simple examples. Very best online coaching center."
    },
    {
        name: "AJEETH RAKKAPAN",
        title: "Engineering Student",
        rating: 5,
        text: "Best staff in maths. I learnt M2 and DM from sir and I’m very satisfied. He ensures understanding."
    },
    {
        name: "KUMARAGURU S",
        title: "Engineering Student",
        rating: 5,
        text: "One of the friendliest teachers. Helps students approach complex problems easily. Very knowledgeable and supportive. Helped me score good grades."
    }
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
    <div className="w-[350px] md:w-[400px] bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full mx-4 hover:shadow-lg hover:border-secondary/30 transition-all duration-300">
        <div className="flex gap-1 mb-4 text-amber-400">
            {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
            ))}
        </div>

        <div className="mb-6 flex-grow relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-100 -z-10 transform -scale-x-100" />
            <p className="text-slate-700 leading-relaxed italic relative z-10 text-sm md:text-base">
                "{testimonial.text}"
            </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                {testimonial.title && (
                    <p className="text-xs text-primary font-medium">{testimonial.title}</p>
                )}
            </div>
        </div>
    </div>
);

export default function Testimonials() {
    const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
    const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

    return (
        <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(14,165,233,0.05),_transparent_40%)]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mb-16 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <ScrollAnimation>
                            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary">
                                Success Stories
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                                Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Testimonials</span>
                            </h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="text-lg text-slate-600">
                                See what our students and parents have to say about their experience with Zero to Hero.
                            </p>
                        </ScrollAnimation>
                    </div>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                {/* Row 1 */}
                <div className="flex mb-8 w-max animate-marquee hover:[animation-play-state:paused]">
                    {[...firstRow, ...firstRow].map((testimonial, index) => (
                        <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
                    ))}
                </div>

                {/* Row 2 */}
                <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                    {[...secondRow, ...secondRow].map((testimonial, index) => (
                        <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}
