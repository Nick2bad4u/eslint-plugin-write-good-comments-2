import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

const featureCards = [
    {
        description:
            "Analyze comment prose only, with markdown-aware handling for inline code spans, block comments, and JSDoc.",
        title: "Comment-aware analysis",
    },
    {
        description:
            "Adopt a low-noise baseline with recommended, or turn on the full six-rule stack with all.",
        title: "Two practical presets",
    },
    {
        description:
            "Combine write-good, inclusive language, profanity, spellcheck, readability, and task-comment checks in one plugin.",
        title: "Six focused rules",
    },
];

const docLinks = [
    {
        href: "/docs/intro",
        label: "Overview",
    },
    {
        href: "/docs/getting-started",
        label: "Getting Started",
    },
    {
        href: "/docs/rules/write-good-comments",
        label: "Rule Reference",
    },
    {
        href: "/docs/rules/presets",
        label: "Presets",
    },
    {
        href: "/docs/developer",
        label: "Developer Notes",
    },
];

export default function Home() {
    return (
        <Layout
            description="Documentation for eslint-plugin-write-good-comments-2 and its six comment-focused lint rules."
            title="eslint-plugin-write-good-comments-2 docs"
        >
            <main>
                <section className="hero hero--primary tropicalHero">
                    <div className="container padding-vert--xl">
                        <p className="tropicalEyebrow">
                            <strong>ESLint plugin</strong>
                        </p>
                        <Heading as="h1">
                            eslint-plugin-write-good-comments-2
                        </Heading>
                        <p className="tropicalHeroLead">
                            Keep source comments clear, inclusive, readable, and
                            maintainable with one plugin built for JavaScript
                            and TypeScript codebases.
                        </p>
                        <div className="buttons">
                            <Link
                                className="button button--primary button--lg"
                                to="/docs/getting-started"
                            >
                                Get started
                            </Link>
                            <Link
                                className="button button--secondary button--lg"
                                href="https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2"
                            >
                                GitHub
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="padding-vert--xl tropicalFeatureSection">
                    <div className="container">
                        <div className="row">
                            {featureCards.map((featureCard) => (
                                <article
                                    key={featureCard.title}
                                    className="col col--4 margin-bottom--lg"
                                >
                                    <div className="tropicalFeatureCard">
                                        <Heading as="h2">
                                            {featureCard.title}
                                        </Heading>
                                        <p>{featureCard.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="padding-vert--xl tropicalDocsSection">
                    <div className="container">
                        <Heading as="h2">Documentation</Heading>
                        <p className="margin-top--md tropicalDocsLead">
                            Start with setup, then drill into presets, rule
                            behavior, or contributor-facing implementation
                            notes.
                        </p>
                        <div className="margin-top--md">
                            {docLinks.map((docLink) => (
                                <Link
                                    key={docLink.href}
                                    className="button button--secondary button--outline margin-right--sm margin-bottom--sm"
                                    to={docLink.href}
                                >
                                    {docLink.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
