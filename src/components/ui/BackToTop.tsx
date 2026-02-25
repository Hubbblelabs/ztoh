'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button after scrolling past the hero section (~100vh)
            if (window.scrollY > window.innerHeight) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-secondary hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                >
                    <ArrowUp
                        size={20}
                        className="group-hover:-translate-y-0.5 transition-transform"
                    />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
