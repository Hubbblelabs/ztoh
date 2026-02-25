'use client';

import { useState, useEffect } from 'react';
import ScrollAnimation from '@/components/animations/ScrollAnimation';
import { Star, Quote, MessageSquare } from 'lucide-react';
import TestimonialModal from '@/components/ui/TestimonialModal';

export const dynamic = 'force-dynamic';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    rating: number;
    content: string;
}

const TestimonialCard = ({
    testimonial,
    onClick,
}: {
    testimonial: Testimonial;
    onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className="w-[350px] md:w-[400px] h-[320px] bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col mx-4 hover:shadow-lg hover:border-secondary/30 transition-all duration-300 relative group cursor-pointer overflow-hidden"
    >
        {/* Decorative quote mark */}
        <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote className="w-16 h-16 text-primary" />
        </div>

        <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                {testimonial.name.charAt(0)}
            </div>
            <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{testimonial.name}</h4>
                {testimonial.role && (
                    <p className="text-xs text-secondary font-medium truncate">
                        {testimonial.role}
                    </p>
                )}
            </div>
        </div>

        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={
                        i < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                    }
                    aria-hidden="true"
                />
            ))}
            <span className="sr-only">{testimonial.rating} out of 5 stars</span>
        </div>

        <div className="grow relative overflow-hidden">
            <p className="text-slate-700 leading-relaxed italic relative z-10 text-sm md:text-base line-clamp-4">
                &quot;{testimonial.content}&quot;
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-white to-transparent pointer-events-none" />
        </div>
    </div>
);

export default function Testimonials({ initialData }: { initialData?: Testimonial[] }) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

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

    if (loading) {
        return (
            <section id="testimonials" className="py-10 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <div className="h-8 w-32 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
                        <div className="h-12 w-96 bg-slate-200 rounded-lg mx-auto mb-4 animate-pulse" />
                        <div className="h-6 w-64 bg-slate-200 rounded-lg mx-auto animate-pulse" />
                    </div>
                    <div className="flex gap-8 justify-center">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-[400px] h-[200px] bg-white rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) return null;

    const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
    const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

    // Ensure we have enough items for the marquee effect by duplicating
    const row1Items = [...firstRow, ...firstRow, ...firstRow, ...firstRow].slice(
        0,
        Math.max(firstRow.length * 4, 10),
    );
    const row2Items = [...secondRow, ...secondRow, ...secondRow, ...secondRow].slice(
        0,
        Math.max(secondRow.length * 4, 10),
    );

    return (
        <section
            id="testimonials"
            className="py-10 bg-slate-100 border-t border-slate-200 relative overflow-hidden"
            aria-label="Student Testimonials"
        >
            <TestimonialModal
                isOpen={!!selectedTestimonial}
                onClose={() => setSelectedTestimonial(null)}
                testimonial={selectedTestimonial}
            />

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_40%)]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mb-16 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <ScrollAnimation>
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary">
                                <MessageSquare size={14} className="text-secondary" />
                                Success Stories
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.1}>
                            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                                Student{' '}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                                    Testimonials
                                </span>
                            </h2>
                        </ScrollAnimation>
                        <ScrollAnimation delay={0.2}>
                            <p className="text-lg text-slate-600">
                                See what our students and parents have to say about their experience
                                with Zero to Hero.
                            </p>
                        </ScrollAnimation>
                    </div>
                </div>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-slate-100 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-slate-100 to-transparent z-10 pointer-events-none" />

                {/* Row 1 */}
                <div
                    className={`flex mb-8 w-max animate-marquee hover:pause ${selectedTestimonial ? 'pause' : ''}`}
                    role="list"
                    aria-label="Testimonials row 1"
                >
                    {row1Items.map((testimonial, index) => (
                        <div key={`row1-${index}`} role="listitem">
                            <TestimonialCard
                                testimonial={testimonial}
                                onClick={() => setSelectedTestimonial(testimonial)}
                            />
                        </div>
                    ))}
                </div>

                {/* Row 2 */}
                <div
                    className={`flex w-max animate-marquee-reverse hover:pause ${selectedTestimonial ? 'pause' : ''}`}
                    role="list"
                    aria-label="Testimonials row 2"
                >
                    {row2Items.map((testimonial, index) => (
                        <div key={`row2-${index}`} role="listitem">
                            <TestimonialCard
                                testimonial={testimonial}
                                onClick={() => setSelectedTestimonial(testimonial)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
