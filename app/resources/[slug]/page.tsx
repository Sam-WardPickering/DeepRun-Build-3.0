import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { articles, getArticle } from "@/lib/articles";

/**
 * The article page. Content comes from lib/articles.ts as trusted,
 * hand-written HTML (it is our own content, not user input), rendered
 * with dangerouslySetInnerHTML. Never render user-supplied content
 * this way.
 */

type Props = { params: Promise<{ slug: string }> };

// Pre-render every article at build time.
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} - Deep Run`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Nav />
      <main className="wrap">
        <article className="article">
          <div className="article-topbar">
            <Link href="/resources" className="back-link">
              ← All resources
            </Link>
            <div className="mono">
              {article.tag}
            </div>
          </div>
          <h1>{article.title}</h1>
          <p className="article-meta">
            {article.minutes} minute read · Deep Run
          </p>
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
