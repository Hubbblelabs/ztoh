"use client";

import { motion, useInView, Variants, UseInViewOptions } from "framer-motion";
import { useRef } from "react";

interface ScrollAnimationProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    delay?: number;
    duration?: number;
    viewport?: UseInViewOptions;
}

export const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function ScrollAnimation({
    children,
    className = "",
    variants = defaultVariants,
    delay = 0,
    duration = 0.5,
    viewport = { once: true, margin: "-50px" },
}: ScrollAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
