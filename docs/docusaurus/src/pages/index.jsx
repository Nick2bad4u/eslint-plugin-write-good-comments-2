import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

const featureCards = [
    {
        description:
            "Run write-good directly against source comments instead of full documents.",
        title: "Focused prose linting",
    },
    {
        description:
            "Adopt the plugin quickly with flat-config presets and one shipped rule.",
        title: "Minimal setup",
    },
    {
        description:
            "Keep README tables and preset docs aligned with generated plugin metadata.",
        title: "Static docs, synced tables",
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
];

export default function Home() {
    return (
        <Layout
            description="Documentation for eslint-plugin-write-good-comments-2."
            title="eslint-plugin-write-good-comments-2 docs"
        >
            <main>
                <section className="hero hero--primary">
                    <div className="container padding-vert--xl">
                        <p>
                            <strong>ESLint plugin</strong>
                        </p>
                        <Heading as="h1">
                            eslint-plugin-write-good-comments-2
                        </Heading>
                        <p>
                            Lint JavaScript and TypeScript source comments with
                            write-good.
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

                <section className="padding-vert--xl">
                    <div className="container">
                        <div className="row">
                            {featureCards.map((featureCard) => (
                                <article
                                    key={featureCard.title}
                                    className="col col--4 margin-bottom--lg"
                                >
                                    <Heading as="h2">
                                        {featureCard.title}
                                    </Heading>
                                    <p>{featureCard.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="padding-vert--xl">
                    <div className="container">
                        <Heading as="h2">Documentation</Heading>
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
