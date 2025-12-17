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
    placeholder = "Select an option...",
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
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {label} {required && <span className="text-secondary">*</span>}
                </label>
            )}

            {/* Hidden input for form submission if needed */}
            {name && <input type="hidden" name={name} value={value} required={required} />}

            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.995 }}
                className={`w-full px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between transition-all duration-300 group ${isOpen
                        ? "border-secondary ring-4 ring-secondary/10 shadow-lg shadow-secondary/5"
                        : "border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                    } bg-white/90 backdrop-blur-sm`}
            >
                <span className={`block truncate transition-colors ${!selectedOption ? "text-slate-400" : "text-slate-900 font-medium"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`ml-2 transition-colors ${isOpen ? 'text-secondary' : 'text-slate-400 group-hover:text-slate-500'}`}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 max-h-64 overflow-auto py-2"
                        style={{
                            boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02)'
                        }}
                    >
                        {options.map((option, index) => (
                            <motion.button
                                key={option.value}
                                type="button"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-all duration-150 mx-1 rounded-xl ${value === option.value
                                        ? "text-secondary font-semibold bg-secondary/5"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                style={{ width: 'calc(100% - 8px)' }}
                            >
                                <span>{option.label}</span>
                                {value === option.value && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center"
                                    >
                                        <Check size={12} className="text-secondary" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
