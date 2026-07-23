import Link from "next/link";
import { articles } from "@/lib/articles";
import DotThumb from "./DotThumb";

/**
 * The resources grid on the homepage. Articles come from lib/articles.ts.
 * A "case studies coming soon" card is shown last - we only publish case
 * studies once there are real clients and real numbers behind them.
 *
 * The section head and each card carry pw-rise classes with staggered
 * delays, so the grid "powers up" left to right as it scrolls into view.
 */
export default function ResourcesGrid() {
  return (
    <section className="resources" id="resources">
      <div className="wrap">
        <div className="section-head" data-pw="rise">
          <div className="mono">
            <span className="dot" />Resources &amp; case studies
          </div>
          <h2>What we&apos;ve learned, written down.</h2>
          <p className="lede">
            Plain-English guides on what actually makes a website earn its
            keep - with the research to back it up.
          </p>
        </div>
        <div className="res-grid">
          {articles.map((a, i) => (
            <Link
              href={`/resources/${a.slug}`}
              className="res-card"
              data-pw="rise"
              style={{ "--pw-delay": `${0.1 + i * 0.08}s` } as React.CSSProperties}
              key={a.slug}
            >
              <div>
                <div className="mono">
                  {a.tag}
                </div>
                <h3>{a.title}</h3>
              </div>
              <div className="thumb">
                <DotThumb seed={a.seed} />
              </div>
            </Link>
          ))}
          <div
            className="res-card res-card-soon"
            data-pw="rise"
            aria-disabled="true"
            style={{ "--pw-delay": "0.42s" } as React.CSSProperties}
          >
            <div>
              <div className="mono">
                Case study
              </div>
              <h3>
                Coming soon - our first client stories, told with real
                numbers
              </h3>
            </div>
            <div className="thumb">
              <DotThumb seed={13} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
