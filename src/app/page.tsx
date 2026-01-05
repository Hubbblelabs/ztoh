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

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Founder />
      <Services />
      <Benefits />
      <Features />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Contact />
    </>
  );
}
