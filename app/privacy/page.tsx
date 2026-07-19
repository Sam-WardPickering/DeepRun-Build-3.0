import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy - Deep Run",
  description:
    "How Deep Run handles your information: plainly, briefly, and honestly.",
};

/**
 * Privacy page. Written in plain English and kept honest - it describes
 * what the site actually does, nothing more. Update it if the site ever
 * starts collecting or storing anything new.
 */
export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="wrap">
        <article className="article">
          <div className="article-topbar">
            <Link href="/" className="back-link">
              ← Back to home
            </Link>
            <div className="mono">
            <span className="dot" />Privacy
          </div>
          </div>
          <h1>Privacy, in plain English</h1>
          <div className="article-body" style={{ marginTop: 36 }}>
            <p>
              This page describes what actually happens with your information
              when you use this site. It is short because we collect very
              little.
            </p>
            <h2>The site check tool</h2>
            <p>
              When you run a site check, the address you enter is fetched by
              our server so the page can be analysed, and the result is shown
              to you. We do not store the addresses you check, the results,
              or anything that identifies you. There is no email gate and no
              tracking attached to the tool.
            </p>
            <h2>The contact form</h2>
            <p>
              The enquiry form opens your own email application with your
              message pre-filled. Nothing is sent or stored by this website -
              the message only goes anywhere when you press send in your own
              email app, and then it simply arrives in our inbox like any
              other email. We use your details to reply to you and for
              nothing else.
            </p>
            <h2>Hosting and analytics</h2>
            <p>
              This site is hosted on Vercel, which keeps standard server logs
              (such as IP addresses and request times) for security and
              reliability. That logging is part of how virtually all web
              hosting works. We do not run advertising trackers or sell data
              to anyone.
            </p>
            <h2>Your rights</h2>
            <p>
              Under New Zealand&apos;s Privacy Act 2020 you can ask us what
              personal information we hold about you, and ask us to correct
              or delete it. For most visitors the honest answer will be
              &quot;none&quot; - but if you have emailed us, we hold that
              correspondence, and you are welcome to ask about it at{" "}
              <a href="mailto:hello@deeprun.co.nz">hello@deeprun.co.nz</a>.
            </p>
            <p>
              If this page ever changes because the site starts doing
              something new, the change will be described here in the same
              plain terms.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
