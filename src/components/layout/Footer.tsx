import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 md:py-20 relative overflow-hidden">
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
                            Empowering students to go from Zero to Hero. We provide top-tier mentorship, expert tutoring, and a pathway to success in your career.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><Facebook size={18} /></Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><Twitter size={18} /></Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><Instagram size={18} /></Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><Linkedin size={18} /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Our Services', 'Testimonials', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-secondary transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Services</h3>
                        <ul className="space-y-3">
                            {['1-on-1 Mentorship', 'Group Tutoring', 'Career Guidance', 'Skill Workshops'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm hover:text-secondary transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 group">
                                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-secondary/20 transition-colors">
                                    <MapPin size={18} className="text-secondary" />
                                </div>
                                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Zero to Hero Online and Home Tutoring Services, 9/13, Gandhi Rd, Periyar Nagar, Nehru Nagar West, East, Tamil Nadu 641014</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-secondary/20 transition-colors">
                                    <Phone size={18} className="text-secondary" />
                                </div>
                                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">+91 95643 21000</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-secondary/20 transition-colors">
                                    <Mail size={18} className="text-secondary" />
                                </div>
                                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">mathsmuthu.j@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Zero to Hero. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
