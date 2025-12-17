"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import ScrollAnimation from "@/components/animations/ScrollAnimation";

const stats = [
    { label: "Courses", value: 25, suffix: "+" },
    { label: "Expert Tutors", value: 20, suffix: "+" },
    { label: "Cities", value: 5, suffix: "+" },
    { label: "Countries", value: 6, suffix: "+" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, spring, value]);

    return (
        <span className="flex items-center justify-center">
            <motion.span ref={ref}>{display}</motion.span>
            <span>{suffix}</span>
        </span>
    );
}

export default function Stats() {
    return (
        <section className="py-20 bg-primary relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent blur-3xl" />
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3 }}></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-white/10">
                    {stats.map((stat, index) => (
                        <ScrollAnimation
                            key={index}
                            delay={index * 0.1}
                            className="flex flex-col items-center p-4"
                        >
                            <div className="text-4xl md:text-6xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-secondary font-bold text-lg md:text-xl tracking-wide uppercase">{stat.label}</div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}
