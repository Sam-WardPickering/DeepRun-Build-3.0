import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About - Deep Run",
  description:
    "Deep Run is a web studio with software engineering in its bones - every site scoped, built and tested like production software.",
};

/**
 * The about page. Studio voice throughout. Everything here is factual:
 * no invented team size, no invented client counts, no inflated numbers.
 * Credibility is the product, so the absence of inflation is the point.
 */
export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="wrap">
        <article className="article">
          <Link href="/" className="back-link">
            ← Back to home
          </Link>
          <div className="mono" style={{ marginTop: 28 }}>
            <span className="dot">●</span>About
          </div>
          <h1>Websites, held to a higher standard.</h1>
          <div className="article-body" style={{ marginTop: 36 }}>
            <p>
              Deep Run comes out of professional software engineering - a
              background of building, shipping and testing production
              systems, along with hands-on design and UX work. We started
              this studio because we kept seeing the same thing: brilliant
              local businesses stuck with websites nobody would accept in
              the software world. Slow, untested, abandoned the day the
              invoice cleared.
            </p>
            <h2>Built like software, because it is software</h2>
            <p>
              Your website is a piece of software your customers use before
              they ever meet you. We treat it that way. Every project is
              scoped in writing before work starts. Every site is built on
              a modern, fast, secure stack and version-controlled, so there
              is always a record of what changed and a way back if anything
              ever needs undoing. Nothing goes live on a guess.
            </p>
            <h2>Tested like it matters</h2>
            <p>
              Quality assurance isn&apos;t a step we added to sound
              thorough - it&apos;s the discipline this studio was built
              around. Finding what&apos;s broken before customers do is a
              professional habit that doesn&apos;t switch off. So before
              any site ships, it gets exercised on real phone and desktop
              screen sizes, checked against accessibility standards, and
              clicked through the way an impatient customer would.
            </p>
            <p>
              We hold our own site to the same bar. The page you&apos;re
              reading ships with an automated test suite covering its
              interactions, security and accessibility, and we run our own
              AI site check against it - the same tool we offer you, no
              special treatment.
            </p>
            <h2>Straight answers, fixed prices</h2>
            <p>
              You&apos;ll always know what a project costs before it
              starts, what&apos;s included, and when it will be live. The
              care plan - hosting, updates, backups, security - is optional
              and always will be. Want a great site simply handed over?
              That works too.
            </p>
            <p>
              Curious where your current site stands?{" "}
              <Link href="/#audit">Run the free site check</Link>, or{" "}
              <Link href="/#contact">get in touch</Link> and tell us what
              you&apos;re working on.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
