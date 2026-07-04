import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ResourcesGrid from "@/components/ResourcesGrid";

export const metadata: Metadata = {
  title: "Resources - Deep Run",
  description:
    "Plain-English guides on what makes a website earn its keep, backed by real research.",
};

/** The resources index page: nav, the same grid as the homepage, footer. */
export default function ResourcesPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 120 }}>
        <ResourcesGrid />
      </main>
      <Footer />
    </>
  );
}
