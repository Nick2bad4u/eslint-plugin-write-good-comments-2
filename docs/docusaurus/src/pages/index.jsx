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
<<<<<<< HEAD
            description="Documentation for eslint-plugin-write-good-comments-2."
            title="eslint-plugin-write-good-comments-2 docs"
||||||| 53124b2
            title="eslint-plugin-typefest docs"
            description="Documentation for eslint-plugin-typefest"
=======
            description="Documentation for eslint-plugin-write-good-comments."
            title="eslint-plugin-write-good-comments docs"
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
        >
            <main>
                <section className="hero hero--primary">
                    <div className="container padding-vert--xl">
                        <p>
                            <strong>ESLint plugin</strong>
                        </p>
                        <Heading as="h1">
<<<<<<< HEAD
                            eslint-plugin-write-good-comments-2
||||||| 53124b2
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div>
                            <p className={styles.heroKicker}>
                                {`${heroKickerIcon} ESLint plugin for modern TypeScript teams ${heroKickerIcon2}`}
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                eslint-plugin-typefest
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                ESLint rules that recommend safer, clearer
                                TypeScript types, type guards, and other
                                patterns by utilizing{" "}
                                <Link
                                    className={`${styles.heroInlineLink} ${styles.heroInlineLinkTypeFest}`}
                                    href="https://github.com/sindresorhus/type-fest"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    type-fest
                                </Link>{" "}
                                and{" "}
                                <Link
                                    className={`${styles.heroInlineLink} ${styles.heroInlineLinkTsExtras}`}
                                    href="https://github.com/sindresorhus/ts-extras"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ts-extras
                                </Link>
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        key={badge.label}
                                        className={styles.heroBadge}
                                    >
                                        <p className={styles.heroBadgeLabel}>
                                            <span
                                                aria-hidden="true"
                                                className={styles.heroBadgeIcon}
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/overview"
                                >
                                    {overviewButtonIcon} Start with Overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/presets"
                                >
                                    {comparePresetsButtonIcon} Compare Presets
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt="eslint-plugin-typefest logo"
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                key={stat.headline}
                                className={styles.heroStatCard}
=======
                            eslint-plugin-write-good-comments
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
