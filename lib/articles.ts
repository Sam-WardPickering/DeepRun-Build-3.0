/**
 * All resource articles live here as plain data. Each article has metadata
 * (used by the grid and for SEO) and a body of HTML (rendered on its page).
 *
 * Every statistic in these articles links to the primary source it came
 * from. If a claim can't be traced to a source, it doesn't get a number.
 */

export type Article = {
  slug: string;
  tag: "Resource" | "Case study";
  title: string;
  excerpt: string;
  minutes: number;
  /** Seed for the generative dot-matrix thumbnail. */
  seed: number;
  body: string;
};

export const articles: Article[] = [
  {
    slug: "five-signs-your-website-is-costing-you-work",
    tag: "Resource",
    title: "Five signs your website is quietly costing you work",
    excerpt:
      "Most business owners never see the customers they lose online. Here's what to look for, and why each one matters.",
    minutes: 5,
    seed: 3,
    body: `
<p>Nobody rings you up to say they found your website slow and went with someone else. They just go with someone else. That's what makes website problems so easy to ignore - the cost is invisible, and business keeps arriving through word of mouth, so everything feels fine.</p>
<p>But if any of the five things below describe your site, you're almost certainly losing enquiries you never knew existed. None of them require technical knowledge to check. Grab your phone and have a look at your own site as if you'd never seen it before.</p>

<h2>1. It takes more than a few seconds to load on your phone</h2>
<p>This is the big one. Google's research found that <a href="https://blog.google/products/admanager/the-need-for-mobile-speed/" target="_blank" rel="noopener">53% of mobile visits are abandoned when a page takes longer than three seconds to load</a>. The same study measured the average mobile site at 19 seconds over a 3G connection. Half your potential customers can walk out the door before they've seen a single word you wrote.</p>
<p>Test it honestly: open your site on mobile data, not your home wifi. Count. If you get bored waiting, so does everyone else.</p>

<h2>2. There's no phone number they can tap</h2>
<p>Most people looking for a local business are on their phone, and many of them want to call, not fill in a form. If your number is an image, buried on a contact page, or plain text that can't be tapped, you've added friction to the exact moment someone decided to get in touch. A tap-to-call link is a one-line fix and it's probably the highest-value line of code on a local business website.</p>

<h2>3. The copyright year in the footer is old</h2>
<p>It sounds trivial. It isn't. A footer that says © 2019 tells every visitor that nobody has touched this site in years - and people quietly wonder what else isn't being looked after. Stanford's web credibility research found that people lean heavily on visible cues like this when deciding whether a business seems trustworthy; in their study of over 2,600 participants, <a href="https://en.wikipedia.org/wiki/Stanford_Web_Credibility_Project" target="_blank" rel="noopener">46% of credibility judgements referenced the site's visual design and presentation</a>. Small details carry more weight than they should. That's just how people work.</p>

<h2>4. It doesn't fit a phone screen</h2>
<p>If visitors have to pinch and zoom to read your services, the site was built for a world that ended around 2012. Search engines notice too - Google predominantly uses the mobile version of a site for indexing and ranking. A site that fights the phone in someone's hand is fighting the way nearly all your customers will find you.</p>

<h2>5. There's no obvious next step</h2>
<p>Look at your homepage and ask: what does this page want me to do? If the answer isn't obvious within a few seconds - get a quote, book a table, call now - then visitors are left to figure it out themselves, and plenty won't bother. Every page should have one clear action, worded the way a customer would say it.</p>

<h2>What to do about it</h2>
<p>If you recognised your site in two or more of these, it's worth acting on. You can hand the list to whoever built your site, or run your site through <a href="/#audit">our free AI site check</a> - it checks all of the above and more, and tells you the single most valuable fix in each category. Takes about twenty seconds, and you don't have to give us your email to see the result.</p>
`,
  },
  {
    slug: "why-accessibility-matters-for-local-business",
    tag: "Resource",
    title: "Why accessibility matters for every local business",
    excerpt:
      "Accessible websites aren't a compliance chore for big corporates. They're a straightforward way to stop turning away customers.",
    minutes: 6,
    seed: 7,
    body: `
<p>Web accessibility has a branding problem. The phrase sounds like paperwork - something for government departments and big corporates with legal teams. So most small businesses never think about it at all.</p>
<p>Here's the reframe: accessibility just means your website works for everyone who tries to use it. People with low vision reading in bright sunlight. Older customers with reading glasses and a tremor. Someone browsing one-handed while holding a toddler. A tradesperson's client using a screen reader. Every one of them is a potential customer, and an inaccessible site turns them away silently.</p>

<h2>The scale of the problem</h2>
<p>Every year, the non-profit WebAIM scans the homepages of the top one million websites. Their 2026 analysis found that <a href="https://webaim.org/projects/million/" target="_blank" rel="noopener">95.9% of homepages had detectable accessibility failures, averaging 56 distinct errors per page</a>. The most common failure - found on 83.9% of pages - was text with contrast too low to read comfortably.</p>
<p>Read that list again as a business owner rather than a developer. These aren't exotic technical failures. They're things like grey text on a white background, images with no description, and forms with unlabelled fields. Ordinary sloppiness, at enormous scale.</p>
<p>And the audience it affects is not small. Stats NZ's Disability Survey has consistently found that <a href="https://www.stats.govt.nz/news/1-in-6-new-zealanders-are-disabled/" target="_blank" rel="noopener">one in six New Zealanders - 851,000 people - is disabled</a>. Add everyone with temporary or situational impairments - a broken wrist, a cracked screen, glare on a job site - and "edge case" stops being the right description.</p>

<h2>The part nobody mentions: accessible sites perform better for everyone</h2>
<p>Almost everything that makes a site accessible also makes it better for every other visitor. High-contrast text is easier for everyone to read. Descriptive headings help everyone scan. Properly labelled forms produce fewer abandoned enquiries. Alt text on images helps search engines understand your pages. There is no trade-off here - it's the same work as building a good website, done properly.</p>

<h2>What the basics look like</h2>
<ul>
<li>Text you can actually read: dark enough, large enough, and not laid over busy photos.</li>
<li>Every image has a short written description (alt text), so screen readers and search engines know what it shows.</li>
<li>Forms with visible labels - not just grey placeholder text that vanishes when you click.</li>
<li>The whole site usable with a keyboard alone, no mouse required.</li>
<li>Headings used in order, like a document outline, rather than for decoration.</li>
</ul>
<p>None of this is expensive when it's part of the build. It only gets expensive when it's retrofitted - which is one more reason to get it right the first time.</p>
<p>Accessibility is baked into every site we build, not sold as an add-on. If you're curious where your current site stands, <a href="/#audit">the free site check</a> covers several of these basics as part of its foundations score.</p>
`,
  },
  {
    slug: "speed-trust-and-google",
    tag: "Resource",
    title: "Speed, trust and Google: what actually moves the needle",
    excerpt:
      "Cut through the SEO noise. For a local business website, three fundamentals do most of the work.",
    minutes: 6,
    seed: 11,
    body: `
<p>Small business owners get sold a lot of mysticism about Google. Secret ranking tricks, monthly "SEO packages" of unclear content, promises of page one. Most of it is noise. For a local business, the fundamentals that actually matter are boring, knowable, and mostly about respecting your visitors' time.</p>

<h2>Speed is a customer-service issue first</h2>
<p>Before it's a ranking factor, speed is about whether people stick around. Google's own research put a number on it years ago and it remains the most useful benchmark: <a href="https://blog.google/products/admanager/the-need-for-mobile-speed/" target="_blank" rel="noopener">53% of mobile visits are abandoned when a page takes more than three seconds to load</a>.</p>
<p>Google also folded speed and stability into how it evaluates pages. Its <a href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener">Core Web Vitals</a> measure how fast a page shows its main content, how quickly it responds to taps, and whether things jump around while loading - and Google states plainly that its core ranking systems reward pages that provide a good page experience. You don't need to memorise the metrics. You need a site built light enough that they pass by default.</p>

<h2>Trust is decided in seconds, on the surface</h2>
<p>People don't audit your credentials before deciding whether you seem legitimate - they react to what's in front of them. The Stanford Web Credibility Project studied how thousands of people judged websites and found that <a href="https://en.wikipedia.org/wiki/Stanford_Web_Credibility_Project" target="_blank" rel="noopener">nearly half of all credibility comments referenced the site's visual design</a> - layout, typography, colour - before anything about the actual content.</p>
<p>For a local business, the trust signals are concrete: a real phone number and address, photos of actual work rather than stock images, an up-to-date footer, HTTPS (the padlock in the browser bar), and reviews you didn't write yourself. Each one is small. Together they answer the only question a visitor is really asking: are these people for real?</p>

<h2>Google is mostly asking the same questions your customers are</h2>
<p>This is the part the mysticism obscures. Modern search rewards pages that load fast, work on phones, say clearly what the business does and where, and give visitors a reason to stay. That's the same list a customer would give you. There are technical layers on top - structured data, local business profiles, sensible page titles - but they're refinements of the fundamentals, not substitutes for them.</p>
<p>So before paying anyone for ongoing SEO, get the foundation right: a fast site, honest trust signals, and clear words about what you do and where you do it. That foundation is exactly what our fixed-price builds deliver, and <a href="/#audit">the free site check</a> will show you how your current site measures up against it.</p>
`,
  },
  {
    slug: "what-good-ux-looks-like-on-a-trade-website",
    tag: "Resource",
    title: "What good UX looks like on a trade business website",
    excerpt:
      "Forget the jargon. For a trades website, user experience comes down to how fast a stranger can decide to call you.",
    minutes: 5,
    seed: 5,
    body: `
<p>"UX" is one of those terms that makes practical people switch off, which is a shame, because for a trade business it describes something completely concrete: how quickly can a stranger with a problem work out that you can fix it, that you cover their area, and how to reach you?</p>
<p>That's the whole job. Someone's hot water cylinder has died, or their switchboard is tripping, or they finally want that deck built. They are not browsing. They're deciding. Your website has one task: make deciding easy.</p>

<h2>The three questions every visitor is asking</h2>
<p>Watch anyone land on a trades website and they're answering three things, in order:</p>
<ul>
<li><b>Do you do the thing I need?</b> Your main heading should say what you do in plain words. "Quality solutions for all your needs" says nothing. "Plumber - repairs, hot water and bathrooms" says everything.</li>
<li><b>Do you work where I live?</b> Name your service area high on the page. People bail out fast when they can't tell if you cover them.</li>
<li><b>How do I get hold of you?</b> A tap-to-call number and a short enquiry form. Both visible without scrolling. Nothing that demands an account, a login, or their life story.</li>
</ul>
<p>If those three are answered in the first screen, your UX is already better than most of your competitors'.</p>

<h2>Where trade websites usually go wrong</h2>
<p>The common failures are all versions of making the visitor work too hard. Contact details hidden on their own page. Enquiry forms with ten required fields when three would do. Galleries that take an age to load because every photo is a full-size original from someone's phone. Text laid over dark photos of previous jobs, at a contrast that's genuinely hard to read - which, incidentally, is <a href="https://webaim.org/projects/million/" target="_blank" rel="noopener">the single most common accessibility failure on the web</a>, found on 83.9% of the million homepages WebAIM analysed in 2026.</p>
<p>And appearances carry real weight. Stanford's credibility research found people judge whether a business seems legitimate largely from <a href="https://en.wikipedia.org/wiki/Stanford_Web_Credibility_Project" target="_blank" rel="noopener">how its website looks and is organised</a>. Fair? Maybe not. But a tidy, fast, clearly-worded site reads as a tidy, reliable operator - and the reverse reads as the reverse.</p>

<h2>A simple test you can run today</h2>
<p>Hand your phone to someone who has never seen your site and give them ten seconds. Then ask: what does this business do, where do they work, and how would you contact them? If they can't answer all three, you've found your problem - and it's very fixable.</p>
<p>Or let the software do it: <a href="/#audit">our free AI site check</a> checks your message, calls to action and credibility signals automatically, and tells you the first thing to fix in each area.</p>
`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
