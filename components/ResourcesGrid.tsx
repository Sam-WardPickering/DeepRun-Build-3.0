import Link from "next/link";
import { articles } from "@/lib/articles";
import DotThumb from "./DotThumb";

/**
 * The resources grid on the homepage. Articles come from lib/articles.ts.
 * A "case studies coming soon" card is shown last - we only publish case
 * studies once there are real clients and real numbers behind them.
 */
export default function ResourcesGrid() {
  return (
    <section className="resources wrap" id="resources">
      <div className="section-head">
        <div className="mono">
          <span className="dot">●</span>Resources &amp; case studies
        </div>
        <h2>What we&apos;ve learned, written down.</h2>
        <p className="lede">
          Plain-English guides on what actually makes a website earn its keep
          - with the research to back it up.
        </p>
      </div>
      <div className="res-grid">
        {articles.map((a) => (
          <Link
            href={`/resources/${a.slug}`}
            className="res-card"
            key={a.slug}
          >
            <div>
              <div className="mono">
                <span className="dot">●</span>
                {a.tag}
              </div>
              <h3>{a.title}</h3>
            </div>
            <div className="thumb">
              <DotThumb seed={a.seed} />
            </div>
          </Link>
        ))}
        <div className="res-card" style={{ cursor: "default" }}>
          <div>
            <div className="mono">
              <span className="dot">●</span>Case study
            </div>
            <h3>Coming soon - our first client stories, told with real numbers</h3>
          </div>
          <div className="thumb">
            <DotThumb seed={13} />
          </div>
        </div>
      </div>
    </section>
  );
}
