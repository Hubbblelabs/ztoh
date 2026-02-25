'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Quote, X, Star } from 'lucide-react';
import { useEffect } from 'react';

interface TestimonialModalProps {
    isOpen: boolean;
    onClose: () => void;
    testimonial: {
        _id: string;
        name: string;
        role: string;
        rating: number;
        content: string;
    } | null;
}

export default function TestimonialModal({ isOpen, onClose, testimonial }: TestimonialModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const modalVariants: Variants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: {
                type: 'spring',
                damping: 30,
                stiffness: 300,
                mass: 0.8,
            },
        },
        exit: {
            x: '100%',
            transition: {
                type: 'spring',
                damping: 30,
                stiffness: 300,
            },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && testimonial && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hover:cursor-pointer"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                            >
                                <X size={24} className="text-slate-500" />
                            </button>

                            <motion.div
                                className="mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="absolute top-8 right-16 opacity-5 pointer-events-none">
                                    <Quote className="w-32 h-32 text-primary" />
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                            {testimonial.name}
                                        </h2>
                                        {testimonial.role && (
                                            <p className="text-secondary font-medium">{testimonial.role}</p>
                                        )}
                                        <div className="flex gap-1 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                            <span className="sr-only">{testimonial.rating} out of 5 stars</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                                    <p className="italic relative z-10">
                                        &quot;{testimonial.content}&quot;
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
