"use client";

import { useState, useEffect } from "react";
import ScrollAnimation from "@/components/animations/ScrollAnimation";
import { Star, Quote } from "lucide-react";

export const dynamic = "force-dynamic";

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    rating: number;
    content: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="w-[350px] md:w-[400px] bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full mx-4 hover:shadow-lg hover:border-secondary/30 transition-all duration-300">
        <div className="flex gap-1 mb-4 text-amber-400">
            {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
            ))}
        </div>

        <div className="mb-6 flex-grow relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-100 -z-10 transform -scale-x-100" />
            <p className="text-slate-700 leading-relaxed italic relative z-10 text-sm md:text-base">
                "{testimonial.content}"
            </p>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                {testimonial.role && (
                    <p className="text-xs text-primary font-medium">{testimonial.role}</p>
                )}
            </div>
        </div>
    </div>
);

export default function Testimonials({ initialData }: { initialData?: Testimonial[] }) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) {
            setLoading(false);
            return;
        }

        const fetchTestimonials = async () => {
            try {
                const response = await fetch('/api/testimonials');
                if (response.ok) {
                    const data = await response.json();
                    setTestimonials(data);
                }
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, [initialData]);

    if (loading) return null;
    if (testimonials.length === 0) return null;

    const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
    const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

    // Ensure we have enough items for the marquee effect by duplicating
    const row1Items = [...firstRow, ...firstRow, ...firstRow, ...firstRow].slice(0, Math.max(firstRow.length * 4, 10));
    const row2Items = [...secondRow, ...secondRow, ...secondRow, ...secondRow].slice(0, Math.max(secondRow.length * 4, 10));

    return (
        <section id="testimonials" className="py-10 bg-slate-100 border-t border-slate-200 relative overflow-hidden">
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
                    {row1Items.map((testimonial, index) => (
                        <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
                    ))}
                </div>

                {/* Row 2 */}
                <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused]">
                    {row2Items.map((testimonial, index) => (
                        <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}
