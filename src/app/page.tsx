import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Founder from "@/components/sections/Founder";
import Services from "@/components/sections/Services";
import Benefits from "@/components/sections/Benefits";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import CallToAction from "@/components/sections/CallToAction";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

async function getTestimonials() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Founder />
      <Services />
      <Benefits />
      <Features />
      <Testimonials initialData={testimonials} />
      <FAQ />
      <CallToAction />
      <Contact />
    </>
  );
}
