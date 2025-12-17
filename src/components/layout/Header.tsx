"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useJoinUsModal } from "@/components/providers/ModalProvider";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { openJoinUsModal } = useJoinUsModal();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "py-3" : "py-5",
                isOpen ? "bg-white" : (scrolled ? "bg-white/80 backdrop-blur-md" : "bg-transparent")
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full flex items-center justify-center ring-2 ring-white/50 shadow-lg">
                        <Image
                            src="/ztoh-logo.png"
                            alt="Zero to Hero Logo"
                            width={60}
                            height={60}
                            className="h-full w-full object-cover"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold font-heading text-primary leading-none tracking-tight group-hover:text-secondary transition-colors">
                            ZERO TO HERO
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-secondary tracking-[0.2em] uppercase">
                            Learn With Confidence
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-semibold text-slate-600 hover:text-primary transition-colors py-1 group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                    <button
                        onClick={openJoinUsModal}
                        className="relative px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full overflow-hidden group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-primary"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 overflow-hidden"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-semibold text-slate-700 hover:text-primary hover:pl-2 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                className="w-full text-center px-5 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 transition-colors mt-2"
                                onClick={() => {
                                    setIsOpen(false);
                                    openJoinUsModal();
                                }}
                            >
                                Get Started
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
