import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About - Deep Run",
  description:
    "Deep Run is a web studio built on a software engineering background - every site scoped, built and tested like production software.",
};

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
          <h1>Built by an engineer. Tested like software.</h1>
          <div className="article-body" style={{ marginTop: 36 }}>
            <p>
              Deep Run is a web studio built on a software engineering
              foundation: more than four years of professional experience
              building, shipping and testing software, alongside hands-on
              work in web design and UI/UX. That combination shapes
              everything about how we work.
            </p>
            <h2>Why the engineering background matters</h2>
            <p>
              Most small-business websites are built once, invoiced, and
              forgotten. The code underneath is whatever got it over the
              line, nobody ever tests it on a real phone, and three years
              later the owner is embarrassed to give out the address.
            </p>
            <p>
              We build websites the way production software gets built.
              Every site is scoped in writing before work starts, built on
              a modern, fast, secure stack, and version-controlled - so
              there is always a record of what changed and a way back if
              anything ever goes wrong.
            </p>
            <h2>The QA habit</h2>
            <p>
              Part of that engineering background is years spent in
              software quality assurance and testing - the discipline whose
              entire job is finding what&apos;s broken before customers do.
              It&apos;s a habit that doesn&apos;t switch off. Before any
              site we build goes live, it gets tested on real phone and
              desktop screen sizes, checked for accessibility, and clicked
              through the way an impatient customer would.
            </p>
            <p>
              We hold our own site to the same bar. This page you&apos;re
              reading ships with an automated test suite covering its core
              interactions and accessibility standards, and we run our own
              AI site check against it - the same tool we offer you, no
              special treatment.
            </p>
            <h2>Straight answers, fixed prices</h2>
            <p>
              You&apos;ll always know what a project costs before it starts,
              what&apos;s included, and when it will be live. The care plan -
              hosting, updates, backups, security - is optional and always
              will be. If you just want a great site handed over, that&apos;s
              a perfectly good way to work with us too.
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
