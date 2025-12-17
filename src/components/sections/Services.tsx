"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    TrendingUp,
    Globe,
    MapPin,
    School,
    Award,
    Cpu,
    GraduationCap,
    ArrowRight
} from "lucide-react";
import ScrollAnimation from "@/components/animations/ScrollAnimation";

const services = [
    {
        title: "SAT Preparation",
        icon: <BookOpen className="w-8 h-8" />,
        description: "The SAT is a standardized test widely used for college admissions in the United States. It has undergone name and scoring changes since its introduction in 1926. The test aims to measure literacy, numeracy, and writing skills relevant to academic success in college. It consists of two main sections: Evidence-Based Reading and Writing (EBRW) and Math, further divided into subsections. Previously, there was an optional essay section, but it has been discontinued in most cases.",
        details: "The total duration of the scored portion is three hours. Scores range from 400 to 1600, with each section scored on a scale of 200 to 800. The SAT includes multiple-choice questions, with some math questions requiring grid-in responses. Points are awarded for correct answers. The test is designed to assess skills learned in school that are essential for college-level problem-solving and analysis."
    },
    {
        title: "MBA Entrance Exams",
        icon: <TrendingUp className="w-8 h-8" />,
        description: "In India, there are several top MBA entrance exams that aspiring candidates should be aware of. These exams include CAT, XAT, TANCET, SNAP, NMAT, CMAT, IIFT, MAT, MAH CET, IBSAT, and more. It is essential for MBA aspirants to gather information about these exams and choose the one that suits them best, as appearing for these exams is mandatory for admission to MBA courses.",
        details: "For instance, candidates aiming for admission to IIMs should appear for CAT, while those targeting Tier-2 private MBA colleges may opt for CMAT or MAT. CAT, conducted by IIMs, is the most popular MBA entrance exam in India, with over 1,200 MBA colleges considering CAT scores for admission. Following CAT, CMAT, conducted by the NTA, is the second most popular MBA entrance exam, accepted by 1,000 MBA colleges across the country. XAT, conducted by XLRI Jamshedpur, is the third most popular MBA entrance exam, with scores accepted by over 800 MBA colleges in India. In addition to these exams, there are more than 50 entrance tests for admission to the top MBA colleges in India. These exams are conducted at three different levels: national level, state level, and university/college level. CAT, CMAT, and MAT are popular at the national level, while exams like MAH-CET, TSICET, APICET, KMAT, and TANCET are well-known at the state level. University/college level exams include XAT, SNAP, IIFT Exam, and IRMASAT, among others."
    },
    {
        title: "IGCSE",
        icon: <Globe className="w-8 h-8" />,
        description: "IGCSE is an English language-based secondary qualification similar to GCSE. It is recognized in the UK as equivalent to GCSE. Developed by Cambridge Assessment International Education, other boards like Edexcel, LRN, and Oxford AQA offer their versions. Students usually start in Year 10 and take the test in Year 11. However, in some schools, it starts in Year 9 and ends in Year 10.",
        details: "Each subject studied earns an IGCSE qualification, including core subjects like First Language, Second Language, Mathematics, and Sciences."
    },
    {
        title: "Tamil Nadu State Board",
        icon: <MapPin className="w-8 h-8" />,
        description: "The Tamil Nadu State Board, also known as State Board School Examinations and Board of Higher Secondary Examinations, is responsible for conducting board examinations for students in Std X and XII.",
        details: "The mark certificates issued by the board are highly valued for further education and job opportunities."
    },
    {
        title: "CBSE",
        icon: <School className="w-8 h-8" />,
        description: "The Central Board of Secondary Education (CBSE) is a national-level education board in India, established in 1929 by the Government of India. It aims to integrate and cooperate in secondary education across states. CBSE has more than 27,000 schools in India and 240 schools in 28 foreign countries affiliated with it. CBSE-affiliated schools follow the NCERT curriculum, especially from classes 9 to 12.",
        details: "The promotion criteria for class 10 and class 12 require students to obtain a minimum of 33% overall, with exemptions for practical examinations. Students who do not pass one or two subjects can take compartment exams, while those failing in three subjects or more must rewrite all subjects the following year."
    },
    {
        title: "International Baccalaureate (IB)",
        icon: <Award className="w-8 h-8" />,
        description: "The International Baccalaureate (IB) offers a range of academic subject groups for students pursuing the IB Diploma. Students must take one subject from groups 1-5 and can choose a second subject from groups 2-5 or group 6. Most subjects have Higher Level (HL) and Standard Level (SL) options, with a recommendation to take a maximum of three HL subjects.",
        details: "The subject groups are as follows: Group 1: Studies in Language and Literature (Focuses on language appreciation, literary criticism, and communication skills). Group 2 Language Acquisition (Encourages proficiency in a second language and understanding of different cultures). Group 3: Individuals and Societies (Explores physical, economic, and social environments, as well as the history of social and cultural institutions). Group 4: Sciences (Covers natural sciences such as biology, chemistry, physics, computer science, design technology, and sports science). Group 5: Mathematics (Offers different mathematics courses suitable for various abilities and interests). Group 6: The Arts (Provides options in dance, music, film, theatre, and visual art, with the opportunity to choose a second subject from other groups). Some subjects have specific variations and new courses have been introduced, catering to different mathematical interests and practical applications."
    },
    {
        title: "NTA & JEE",
        icon: <Cpu className="w-8 h-8" />,
        description: "The National Testing Agency (NTA) is an independent organization established by the Ministry of Education, Government of India, to conduct standardized tests for admission to higher education institutions. The NTA's mission is to improve equity and quality in education by developing and administering valid, reliable, and transparent assessments. They engage with stakeholders such as students, parents, teachers, experts, and partner institutions to ensure quality and effectiveness.",
        details: "The Joint Entrance Examination (JEE) is conducted by the NTA and consists of two papers. Paper 1 is for admission to undergraduate engineering programs, while Paper 2 is for admission to B. Arch and B. Planning courses. The JEE (Main) will be conducted in two sessions, providing candidates with two opportunities to improve their scores and learn from their mistakes. The NTA aims to reduce the chances of students dropping a year by offering multiple exam sessions. If a candidate misses one session due to uncontrollable reasons, they do not have to wait for a whole year. Candidates can choose to appear in one or both sessions, and the best scores will be considered for the merit list/ranking. To accommodate variations in syllabus reduction by different boards, the NTA provides choices in one section of each subject while maintaining the same number of questions to be attempted. Overall, the NTA strives to ensure fair and efficient assessments that benefit students and contribute to the improvement of education quality and equity."
    }
];

const courseOfferings = [
    {
        category: "CBSE",
        courses: ["Class 9", "Class 10", "Class 11", "Class 12"]
    },
    {
        category: "State Board",
        courses: ["Class 9", "Class 10", "Class 11", "Class 12"]
    },
    {
        category: "IGCSE",
        courses: ["Class 9", "Class 10", "Diploma"]
    },
    {
        category: "Entrance Exams",
        courses: ["JEE", "CAT", "MAT", "TANCET", "CUCET JAM", "Deemed Universities Entrance Exams"]
    },
    {
        category: "A & AS",
        courses: ["Management", "Mathematics", "Physics", "Chemistry", "Computer Science", "Accounts", "Economics"]
    },
    {
        category: "SAT",
        courses: ["SAT", "GRE"]
    },
    {
        category: "IB",
        courses: ["Mathematics", "Physics", "Chemistry", "Computer Science", "Accounts", "Economics", "Management"]
    },
    {
        category: "Spoken English",
        courses: ["Spoken English"]
    },
    {
        category: "Interview Preparation",
        courses: ["Aptitude", "Logical Thinking", "Programming"]
    }
];

import { useState } from "react";
import ServiceModal from "@/components/ui/ServiceModal";

export default function Services() {
    const [selectedService, setSelectedService] = useState<{
        title: string;
        icon: React.ReactNode;
        description: string;
        details?: string;
    } | null>(null);

    return (
        <section id="services" className="py-24 bg-slate-50 relative">
            <ServiceModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <ScrollAnimation>
                        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-primary">
                            What We Offer
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.1}>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Services</span>
                        </h2>
                    </ScrollAnimation>
                    <ScrollAnimation delay={0.2}>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Comprehensive educational support tailored to your needs, from school boards to competitive entrance exams.
                        </p>
                    </ScrollAnimation>
                </div>

                {/* Detailed Services Carousel */}
                <div className="relative mb-24 group overflow-hidden">
                    <div className="flex gap-6">
                        <div
                            className={`flex gap-6 animate-marquee hover:pause ${selectedService ? 'pause' : ''}`}
                            style={{ width: "max-content" }}
                        >
                            {[...services, ...services].map((service, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedService(service)}
                                    className="shrink-0 w-[85vw] md:w-[400px] flex flex-col bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-secondary/50 hover:-translate-y-2 transition-all duration-300 h-[400px] cursor-pointer group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner mb-6">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                                    <div className="flex-grow overflow-hidden relative">
                                        <p className="text-slate-600 leading-relaxed text-sm line-clamp-4">
                                            {service.description}
                                        </p>
                                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                    <div
                                        className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all group/btn"
                                    >
                                        Read More
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Fade edges */}
                    <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
                    <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
                </div>

                {/* Course Offerings Grid */}
                <div className="relative rounded-[3rem] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900 z-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 p-8 md:p-20 text-white">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold font-heading mb-4">Course Offerings</h3>
                            <p className="text-slate-400 text-lg">Explore our wide range of subjects and classes</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courseOfferings.map((category, index) => (
                                <ScrollAnimation
                                    key={index}
                                    delay={index * 0.05}
                                    className="h-full"
                                >
                                    <div className="glass-dark p-6 rounded-2xl hover:bg-white/10 transition-colors group h-full border border-white/5 hover:border-white/20">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-white/5 group-hover:bg-secondary/20 transition-colors">
                                                <GraduationCap className="text-secondary" size={24} />
                                            </div>
                                            <h4 className="text-xl font-bold group-hover:text-secondary transition-colors">{category.category}</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {category.courses.map((course, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-slate-300 text-sm group/item">
                                                    <ArrowRight size={12} className="text-slate-500 group-hover/item:text-secondary transition-colors" />
                                                    {course}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
