'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Send,
    Heart,
} from 'lucide-react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <>
            {/* Wave Divider */}
            <div className="relative bg-white">
                <svg
                    className="block w-full h-16 md:h-24"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V100H0V40Z"
                        className="fill-slate-900"
                    />
                </svg>
            </div>

            <footer className="bg-slate-900 text-slate-300 pt-8 pb-10 md:pt-12 md:pb-12 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-3xl" />
                    <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand Info */}
                        <div className="space-y-6">
                            <Link href="/" className="text-3xl font-bold font-heading text-white block">
                                ZTOH<span className="text-secondary">.org</span>
                            </Link>
                            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                                Empowering students to go from Zero to Hero. We provide top-tier
                                mentorship, expert tutoring, and a pathway to success in your career.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { icon: <Facebook size={18} />, href: '#', label: 'Facebook', hoverBg: 'hover:bg-blue-600' },
                                    { icon: <Twitter size={18} />, href: '#', label: 'Twitter', hoverBg: 'hover:bg-sky-500' },
                                    { icon: <Instagram size={18} />, href: '#', label: 'Instagram', hoverBg: 'hover:bg-pink-600' },
                                    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn', hoverBg: 'hover:bg-blue-700' },
                                ].map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center ${social.hoverBg} hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300`}
                                    >
                                        {social.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Home', href: '/' },
                                    { name: 'About Us', href: '#about' },
                                    { name: 'Our Services', href: '#services' },
                                    { name: 'Testimonials', href: '#testimonials' },
                                    { name: 'Contact', href: '#contact' },
                                    { name: 'Privacy Policy', href: '/privacy-policy' },
                                    { name: 'Terms of Service', href: '/terms-of-service' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm hover:text-secondary transition-colors flex items-center gap-2 group"
                                        >
                                            <ArrowRight
                                                size={12}
                                                className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-lg">Services</h3>
                            <ul className="space-y-3">
                                {[
                                    '1-on-1 Mentorship',
                                    'Group Tutoring',
                                    'Career Guidance',
                                    'Skill Workshops',
                                    'Competitive Exams',
                                    'Board Preparation',
                                ].map((item) => (
                                    <li key={item}>
                                        <Link
                                            href="#services"
                                            className="text-sm hover:text-secondary transition-colors flex items-center gap-2 group"
                                        >
                                            <ArrowRight
                                                size={12}
                                                className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                                            />
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info + Newsletter */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-secondary/20 transition-colors shrink-0">
                                        <MapPin size={18} className="text-secondary" />
                                    </div>
                                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                                        Zero to Hero, 9/13, Gandhi Rd, Periyar Nagar, Coimbatore, TN 641014
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-secondary/20 transition-colors">
                                        <Phone size={18} className="text-secondary" />
                                    </div>
                                    <a href="tel:+919564321000" className="text-sm text-slate-400 group-hover:text-white transition-colors">
                                        +91 95643 21000
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-secondary/20 transition-colors">
                                        <Mail size={18} className="text-secondary" />
                                    </div>
                                    <a href="mailto:reachus@ztoh.org" className="text-sm text-slate-400 group-hover:text-white transition-colors">
                                        reachus@ztoh.org
                                    </a>
                                </li>
                            </ul>

                            {/* Newsletter */}
                            <div>
                                <h4 className="text-white font-semibold mb-3 text-sm">Stay Updated</h4>
                                <form onSubmit={handleNewsletter} className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary/80 transition-colors shrink-0"
                                        aria-label="Subscribe to newsletter"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                                {subscribed && (
                                    <p className="text-green-400 text-xs mt-2 animate-fade-in-up">
                                        ✓ Thanks for subscribing!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                        <p className="flex items-center gap-1">
                            &copy; {new Date().getFullYear()} Zero to Hero. Made with{' '}
                            <Heart size={14} className="text-red-500 fill-red-500" /> All rights reserved.
                        </p>

                        <div className="flex items-center justify-center gap-2 order-3 md:order-2 flex-wrap">
                            <span>Designed and Developed by</span>
                            <Link
                                href="https://teammistake.com"
                                target="_blank"
                                className="flex items-center gap-2 hover:text-white transition-colors group"
                            >
                                <Image
                                    src="https://teammistake.com/team-mistake.png"
                                    alt="TM"
                                    width={24}
                                    height={24}
                                    className="h-6 w-auto"
                                />
                                <span className="font-semibold text-slate-400 group-hover:text-white transition-colors">
                                    TeamMistake Technologies
                                </span>
                            </Link>
                        </div>

                        <div className="flex gap-6 order-2 md:order-3">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
