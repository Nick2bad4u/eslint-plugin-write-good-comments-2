import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config, PluginModule } from "@docusaurus/types";

import { createRequire } from "node:module";
import { themes as prismThemes } from "prism-react-renderer";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-write-good-comments-2";
const siteTitle = "eslint-plugin-write-good-comments-2";
const siteTagline =
    "Lint source comments for clarity, tone, spelling, readability, and task hygiene.";
const siteUrl = "https://nick2bad4u.github.io";
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ??
    "/eslint-plugin-write-good-comments-2/";
const enableExperimentalFaster =
    process.env["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true";
const siteDescription =
    "Lint source comments for clarity, tone, spelling, readability, and task hygiene.";
const siteKeywords =
    "eslint, eslint-plugin, comments, documentation, readability, spellcheck, static analysis";
const socialCardImagePath = "img/logo.png";
const socialCardImage = new URL(socialCardImagePath, `${siteUrl}${baseUrl}`);
const socialCardImageUrl = socialCardImage.href;
const pwaThemeColor = "#097C87";
const pwaTileColor = "#097C87";
const pwaMaskIconColor = "#23CED9";
const legacyPostBuildHeadAttributeFlagKey: string = [
    "remove",
    "Le",
    "gacyPostBuildHeadAttribute",
].join("");
const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> 💻 Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">🦖 Docusaurus</a>.';

const requireFromDocsWorkspace = createRequire(import.meta.url);
const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
    typeof value === "object" && value !== null && !Array.isArray(value);
const loadSharedMermaidConfig = (): Readonly<Record<string, unknown>> => {
    const value: unknown = requireFromDocsWorkspace(
        "mermaid-config-nick2bad4u/mermaid.config.json"
    );

    if (!isRecord(value)) {
        throw new TypeError(
            "Expected the shared Mermaid config to be an object."
        );
    }

    return value;
};
const sharedMermaidConfig = loadSharedMermaidConfig();

const resolveOptionalModule = (moduleSpecifier: string): string | undefined => {
    try {
        return requireFromDocsWorkspace.resolve(moduleSpecifier);
    } catch {
        return undefined;
    }
};

const vscodeCssLanguageServiceEsmEntry = resolveOptionalModule(
    "vscode-css-languageservice/lib/esm/cssLanguageService.js"
);
const vscodeLanguageServerTypesEsmEntry = resolveOptionalModule(
    "vscode-languageserver-types/lib/esm/main.js"
);

const futureConfig = {
    ...(enableExperimentalFaster && {
        faster: {
            mdxCrossCompilerCache: true,
            rspackBundler: true,
            rspackPersistentCache: true,
            ssgWorkerThreads: true,
        },
    }),
    v4: {
        fasterByDefault: true,
        [legacyPostBuildHeadAttributeFlagKey]: true,
        mdx1CompatDisabledByDefault: true,
        removeLegacyPostBuildHeadAttribute: true,
        siteStorageNamespacing: true,
        useCssCascadeLayers: false,
    },
} satisfies Config["future"];

const suppressKnownWebpackWarningsPlugin: PluginModule = () => ({
    configureWebpack: () => ({
        ignoreWarnings: [
            (warning: unknown) => {
                const warningRecord = warning as
                    Readonly<Record<string, unknown>> | undefined;
                const warningMessage = warningRecord?.["message"];

                return (
                    typeof warningMessage === "string" &&
                    warningMessage.includes(
                        "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
                    )
                );
            },
        ],
        resolve: {
            alias: {
                ...(vscodeCssLanguageServiceEsmEntry !== undefined && {
                    "vscode-css-languageservice$":
                        vscodeCssLanguageServiceEsmEntry,
                }),
                ...(vscodeLanguageServerTypesEsmEntry !== undefined && {
                    "vscode-languageserver-types$":
                        vscodeLanguageServerTypesEsmEntry,
                    "vscode-languageserver-types/lib/umd/main.js$":
                        vscodeLanguageServerTypesEsmEntry,
                }),
            },
        },
    }),
    name: "suppress-known-webpack-warnings",
});

const config: Config = {
    baseUrl,
    baseUrlIssueBanner: true,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.ico",
    future: futureConfig,
    headTags: [
        {
            attributes: {
                href: siteUrl,
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                href: "https://github.com",
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                description: siteDescription,
                image: socialCardImageUrl,
                name: `${projectName} Documentation`,
                publisher: {
                    "@type": "Person",
                    name: "Nick2bad4u",
                    url: "https://github.com/Nick2bad4u",
                },
                url: `${siteUrl}${baseUrl}`,
            }),
            tagName: "script",
        },
    ],
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        anchors: {
            maintainCase: true,
        },
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    noIndex: false,
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        suppressKnownWebpackWarningsPlugin,
        "docusaurus-plugin-image-zoom",
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: pwaThemeColor,
                        name: "theme-color",
                        tagName: "meta",
                    },
                    {
                        content: "yes",
                        name: "apple-mobile-web-app-capable",
                        tagName: "meta",
                    },
                    {
                        content: "default",
                        name: "apple-mobile-web-app-status-bar-style",
                        tagName: "meta",
                    },
                    {
                        href: `${baseUrl}img/icon-192.png`,
                        rel: "apple-touch-icon",
                        tagName: "link",
                    },
                    {
                        color: pwaMaskIconColor,
                        href: `${baseUrl}img/icon-512.svg`,
                        rel: "mask-icon",
                        tagName: "link",
                    },
                    {
                        content: `${baseUrl}img/icon-192.png`,
                        name: "msapplication-TileImage",
                        tagName: "meta",
                    },
                    {
                        content: pwaTileColor,
                        name: "msapplication-TileColor",
                        tagName: "meta",
                    },
                ],
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: "./sidebars.rules.ts",
            } satisfies DocsPluginOptions,
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    breadcrumbs: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    includeCurrentVersion: true,
                    onInlineTags: "ignore",
                    path: "site-docs",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: false,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
                },
                googleTagManager: {
                    containerId: "GTM-T8J6HPLF",
                },
                gtag: {
                    trackingID: "G-18DR1S6R1T",
                },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
                        "**/*.d.ts",
                        "**/*.d.tsx",
                        "**/__tests__/**",
                        "**/*.test.{js,jsx,ts,tsx}",
                        "**/*.spec.{js,jsx,ts,tsx}",
                    ],
                    include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
                    mdxPageComponent: "@theme/MDXPage",
                    path: "src/pages",
                    routeBasePath: "/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                sitemap: {
                    changefreq: "weekly",
                    filename: "sitemap.xml",
                    lastmod: "datetime",
                    priority: 0.5,
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    staticDirectories: ["static"],
    storage: {
        namespace: true,
        type: "localStorage",
    },
    tagline: siteTagline,
    themeConfig: {
        colorMode: {
            defaultMode: "light",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        footer: {
            copyright: footerCopyright,
            links: [
                {
                    items: [
                        {
                            label: "📖 Overview",
                            to: "/docs/intro",
                        },
                        {
                            label: "📜 Rules",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "🎛️ Presets",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "📖 API Reference",
                            to: "/docs/developer/api",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            href: `https://www.npmjs.com/package/eslint-plugin-write-good-comments-2`,
                            label: "📦 npm",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "🐙 GitHub",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/issues`,
                            label: "🐛 Issues",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "🏷️ Releases",
                        },
                    ],
                    title: "Project",
                },
                {
                    items: [
                        {
                            label: "🧑‍💻 Developer Notes",
                            to: "/docs/developer",
                        },
                        {
                            label: "📖 TypeDoc API",
                            to: "/docs/developer/api",
                        },
                        {
                            href: "https://github.com/retextjs",
                            label: "🌐 retext Ecosystem",
                        },
                        {
                            href: "https://github.com/streetsidesoftware/cspell",
                            label: "🌐 cspell",
                        },
                    ],
                    title: "More",
                },
            ],
        },
        image: socialCardImagePath,
        mermaid: {
            options: {
                ...sharedMermaidConfig,
                startOnLoad: false,
            },
        },
        metadata: [
            {
                content: siteTitle,
                name: "application-name",
            },
            {
                content: siteDescription,
                name: "description",
            },
            {
                content: siteKeywords,
                name: "keywords",
            },
            {
                content: projectName,
                property: "og:site_name",
            },
        ],
        navbar: {
            hideOnScroll: false,
            items: [
                {
                    label: "📖 Docs",
                    position: "left",
                    to: "/docs/intro",
                },
                {
                    label: "📏 Rules",
                    position: "left",
                    to: "/docs/rules/overview",
                },
                {
                    label: "🛠️ API",
                    position: "left",
                    to: "/docs/developer/api",
                },
                {
                    label: "🎛️ Presets",
                    position: "left",
                    to: "/docs/rules/presets",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}/releases`,
                    label: "🏷️ Releases",
                    position: "right",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "🐙 GitHub",
                    position: "right",
                },
                {
                    href: `https://www.npmjs.com/package/eslint-plugin-write-good-comments-2`,
                    label: "📦 npm",
                    position: "right",
                },
            ],
            logo: {
                alt: "eslint-plugin-write-good-comments-2 logo.",
                src: "img/logo.svg",
            },
            title: siteTitle,
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "typescript",
            ],
            darkTheme: prismThemes.oneDark,
            theme: prismThemes.github,
        },
        zoom: {
            background: {
                dark: "rgb(24, 25, 26)",
                light: "rgb(255, 255, 255)",
            },
            config: {
                margin: 24,
            },
            selector: ".markdown :not(em) > img",
        },
    },
    themes: [
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                blogDir: "blog",
                blogRouteBasePath: "blog",
                docsDir: "site-docs",
                docsRouteBasePath: "docs",
                explicitSearchResultPath: false,
                forceIgnoreNoIndex: true,
                fuzzyMatchingDistance: 1,
                hashed: true,
                hideSearchBarWithNoSearchContext: false,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: true,
                indexDocs: true,
                indexPages: false,
                language: ["en"],
                removeDefaultStemmer: true,
                removeDefaultStopWordFilter: false,
                searchBarPosition: "right",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 8,
                useAllContextsWithNoSearchContext: false,
            },
        ],
    ],
    title: siteTitle,
    titleDelimiter: "|",
    trailingSlash: true,
    url: siteUrl,
} satisfies Config;

export default config;
