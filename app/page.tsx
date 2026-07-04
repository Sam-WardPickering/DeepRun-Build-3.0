import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import AuditModule from "@/components/AuditModule";
import Marquee from "@/components/Marquee";
import Pricing from "@/components/Pricing";
import ResourcesGrid from "@/components/ResourcesGrid";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/** The homepage: every section is its own component in /components. */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Manifesto />
        <AuditModule />
        <Marquee />
        <Pricing />
        <ResourcesGrid />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
