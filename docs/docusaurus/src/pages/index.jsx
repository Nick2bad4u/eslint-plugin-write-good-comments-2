import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

const liveBadges = [
    {
        alt: "npm version badge",
        href: "https://www.npmjs.com/package/eslint-plugin-write-good-comments-2",
        src: "https://flat.badgen.net/npm/v/eslint-plugin-write-good-comments-2?color=23CED9",
    },
    {
        alt: "npm total downloads badge",
        href: "https://www.npmjs.com/package/eslint-plugin-write-good-comments-2",
        src: "https://flat.badgen.net/npm/dt/eslint-plugin-write-good-comments-2?color=A1CCA6",
    },
    {
        alt: "latest GitHub release badge",
        href: "https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/releases",
        src: "https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-write-good-comments-2?color=FCA47C",
    },
    {
        alt: "open GitHub stars badge",
        href: "https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/stargazers",
        src: "https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-write-good-comments-2?color=yellow",
    },
    {
        alt: "open GitHub issues badge",
        href: "https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/issues",
        src: "https://flat.badgen.net/github/issues/Nick2bad4u/eslint-plugin-write-good-comments-2?color=red",
    },
    {
        alt: "codecov coverage badge",
        href: "https://codecov.io/gh/Nick2bad4u/eslint-plugin-write-good-comments-2",
        src: "https://flat.badgen.net/codecov/github/Nick2bad4u/eslint-plugin-write-good-comments-2?color=blue",
    },
    {
        alt: "GitHub actions CI badge",
        href: "https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2/actions/workflows/ci.yml",
        src: "https://img.shields.io/github/actions/workflow/status/Nick2bad4u/eslint-plugin-write-good-comments-2/ci.yml?branch=main&style=flat-square&label=CI&color=teal",
    },
];

const heroStats = [
    {
        eyebrow: "Rules",
        value: "6 shipped",
    },
    {
        eyebrow: "Presets",
        value: "2 rollout-ready",
    },
    {
        eyebrow: "Runtime",
        value: "ESM + CJS",
    },
];

const featureCards = [
    {
        ctaHref: "/docs/rules/overview",
        ctaLabel: "Open overview →",
        description:
            "Analyze comment prose only, with markdown-aware handling for inline code spans, block comments, and JSDoc.",
        icon: "🧭",
        title: "Comment-aware analysis",
    },
    {
        ctaHref: "/docs/rules/presets",
        ctaLabel: "Compare presets →",
        description:
            "Adopt a low-noise baseline with recommended, or turn on the full six-rule stack with all.",
        icon: "🧩",
        title: "Two practical presets",
    },
    {
        ctaHref: "/docs/rules/overview",
        ctaLabel: "Browse rules →",
        description:
            "Combine write-good, inclusive language, profanity, spellcheck, readability, and task-comment checks in one plugin.",
        icon: "📚",
        title: "Six focused rules",
    },
];

const docLinks = [
    {
        description: "Start at the package overview and rollout guidance.",
        href: "/docs/intro",
        icon: "🏁",
        label: "Overview",
    },
    {
        description:
            "Install the plugin and enable the recommended preset fast.",
        href: "/docs/getting-started",
        icon: "⚡",
        label: "Getting Started",
    },
    {
        description:
            "Review preset composition and the full six-rule reference.",
        href: "/docs/rules/write-good-comments",
        icon: "📏",
        label: "Rule Reference",
    },
    {
        description: "Compare recommended versus all before wider rollout.",
        href: "/docs/rules/presets",
        icon: "🛠️",
        label: "Presets",
    },
    {
        description: "Open contributor notes and the generated TypeDoc pages.",
        href: "/docs/developer",
        icon: "🧪",
        label: "Developer Docs",
    },
    {
        description:
            "Inspect the published plugin surface and exported type aliases.",
        href: "/docs/developer/api",
        icon: "🧬",
        label: "API Reference",
    },
];

/** Render the docs landing page for the plugin website. */
export default function Home() {
    const heroLogoSource = useBaseUrl("img/logo.svg");

    return (
        <Layout
            description="Documentation for eslint-plugin-write-good-comments-2 and its six comment-focused lint rules."
            title="eslint-plugin-write-good-comments-2 docs"
        >
            <main>
                <section className="hero hero--primary tropicalHero">
                    <div className="container padding-vert--xl">
                        <div className="row tropicalHeroRow">
                            <div className="col col--7">
                                <p className="tropicalEyebrow">
                                    <strong>
                                        ESLint plugin for source comment quality
                                    </strong>
                                </p>
                                <Heading as="h1">
                                    eslint-plugin-write-good-comments-2
                                </Heading>
                                <p className="tropicalHeroLead">
                                    Keep source comments clear, inclusive,
                                    readable, and maintainable with one plugin
                                    built for modern JavaScript and TypeScript
                                    teams.
                                </p>
                                <div className="buttons tropicalHeroButtons">
                                    <Link
                                        className="button button--primary button--lg"
                                        to="/docs/getting-started"
                                    >
                                        Start with Getting Started
                                    </Link>
                                    <Link
                                        className="button button--secondary button--lg"
                                        to="/docs/rules/overview"
                                    >
                                        Browse Rule Reference
                                    </Link>
                                </div>
                                <ul
                                    aria-label="Live project badges"
                                    className="tropicalBadgeRow"
                                >
                                    {liveBadges.map((badge) => (
                                        <li
                                            className="tropicalBadgeListItem"
                                            key={badge.src}
                                        >
                                            <Link
                                                className="tropicalBadgeLink"
                                                href={badge.href}
                                            >
                                                <img
                                                    alt={badge.alt}
                                                    className="tropicalBadgeImage"
                                                    loading="lazy"
                                                    src={badge.src}
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <ul
                                    aria-label="Project highlights"
                                    className="tropicalHeroStats"
                                >
                                    {heroStats.map((heroStat) => (
                                        <li
                                            className="tropicalHeroStat"
                                            key={heroStat.eyebrow}
                                        >
                                            <span className="tropicalHeroStatEyebrow">
                                                {heroStat.eyebrow}
                                            </span>
                                            <strong>{heroStat.value}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col col--5 tropicalHeroLogoColumn">
                                <div className="tropicalHeroLogoFrame">
                                    <img
                                        alt="eslint-plugin-write-good-comments-2 tropical jade sunrise logo"
                                        className="tropicalHeroLogo"
                                        src={heroLogoSource}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="padding-vert--xl tropicalFeatureSection">
                    <div className="container">
                        <div className="tropicalSectionHeading">
                            <p className="tropicalSectionEyebrow">Highlights</p>
                            <Heading as="h2">
                                Built for comment-focused linting workflows
                            </Heading>
                            <p className="tropicalDocsLead">
                                The docs site now points directly at the most
                                useful rollout, rule, preset, and API paths
                                instead of making you hunt through multiple
                                shallow entry pages.
                            </p>
                        </div>
                        <div className="row">
                            {featureCards.map((featureCard) => (
                                <article
                                    className="col col--4 margin-bottom--lg"
                                    key={featureCard.title}
                                >
                                    <div className="tropicalFeatureCard">
                                        <p
                                            aria-hidden="true"
                                            className="tropicalCardIcon"
                                        >
                                            {featureCard.icon}
                                        </p>
                                        <Heading as="h2">
                                            {featureCard.title}
                                        </Heading>
                                        <p>{featureCard.description}</p>
                                        <Link
                                            className="tropicalCardLink"
                                            to={featureCard.ctaHref}
                                        >
                                            {featureCard.ctaLabel}
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="padding-vert--xl tropicalDocsSection">
                    <div className="container">
                        <div className="tropicalSectionHeading">
                            <p className="tropicalSectionEyebrow">
                                Documentation
                            </p>
                            <Heading as="h2">
                                Start where you need to work
                            </Heading>
                        </div>
                        <p className="margin-top--md tropicalDocsLead">
                            Jump directly into rollout guides, the full rule
                            reference, or contributor-facing API and maintenance
                            docs.
                        </p>
                        <div className="row margin-top--lg">
                            {docLinks.map((docLink) => (
                                <article
                                    className="col col--4 margin-bottom--lg"
                                    key={docLink.href}
                                >
                                    <Link
                                        className="tropicalDocsCard"
                                        to={docLink.href}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="tropicalDocsCardIcon"
                                        >
                                            {docLink.icon}
                                        </span>
                                        <strong>{docLink.label}</strong>
                                        <span>{docLink.description}</span>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
