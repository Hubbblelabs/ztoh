'use client';

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppIcon() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Desktop: Original expandable WhatsApp button */}
            <a
                href="https://wa.me/919564321000"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex group items-center justify-center"
                aria-label="Chat on WhatsApp"
            >
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2 overflow-hidden w-16 group-hover:w-48">
                        <FaWhatsapp className="w-8 h-8 shrink-0" />
                        <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                            Chat With Us
                        </span>
                    </div>
                </div>
            </a>

            {/* Mobile: Collapsible FAB */}
            <div className="lg:hidden">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-16 left-0 flex flex-col gap-3 mb-2"
                        >
                            {/* WhatsApp Option */}
                            <motion.a
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                href="https://wa.me/919564321000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 group"
                                aria-label="Chat on WhatsApp"
                            >
                                <div className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
                                    <FaWhatsapp className="w-6 h-6" />
                                </div>
                                <span className="bg-white text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap">
                                    WhatsApp
                                </span>
                            </motion.a>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FAB Toggle Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                    aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
                >
                    {!isOpen && (
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>
                    )}
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <X className="w-7 h-7 relative z-10" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <MessageCircle className="w-7 h-7 relative z-10" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}
