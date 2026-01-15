"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    name?: string;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    label,
    required = false,
    name
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={containerRef}>
            {/* Hidden input for form submission if needed */}
            {name && <input type="hidden" name={name} value={value} required={required} />}

            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.995 }}
                className={`flex h-12 w-full items-center rounded-md border bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm group
                    ${isOpen
                        ? "border-zinc-400 ring-2 ring-zinc-200 dark:ring-zinc-500"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
            >
                {/* Inline Label */}
                {label && (
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap flex items-center mr-1 select-none pointer-events-none">
                        {label}
                        <span className="mx-1">:</span>
                    </span>
                )}

                <span className={`block flex-1 text-left truncate transition-colors px-0 ${!selectedOption ? "text-muted-foreground" : "text-foreground"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`ml-2 transition-colors flex-shrink-0 ${isOpen ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    <ChevronDown size={16} className="opacity-50" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-64 overflow-auto py-1"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 text-left text-sm flex items-center gap-3 transition-colors
                                    ${value === option.value
                                        ? "text-foreground font-medium"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {/* Checkmark on the left for selected item */}
                                <span className="w-4 flex-shrink-0">
                                    {value === option.value && (
                                        <Check size={14} className="text-slate-700" strokeWidth={2.5} />
                                    )}
                                </span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
