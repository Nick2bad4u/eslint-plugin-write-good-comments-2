import { themes as prismThemes } from "prism-react-renderer";

import type { Config } from "@docusaurus/types";
import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import { fileURLToPath } from "node:url";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-write-good-comments-2";
const siteTitle = "eslint-plugin-write-good-comments-2";
const siteTagline =
    "Lint source comments for clarity, tone, spelling, readability, and task hygiene.";
const siteUrl = "https://nick2bad4u.github.io";
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ??
    "/eslint-plugin-write-good-comments-2/";
const modernEnhancementsClientModule = fileURLToPath(
    new URL("src/js/modernEnhancements.ts", import.meta.url)
);
const vscodeCssLanguageServiceEsmEntry = fileURLToPath(
    new URL(
        "../../node_modules/vscode-css-languageservice/lib/esm/cssLanguageService.js",
        import.meta.url
    )
);
const vscodeLanguageServerTypesEsmEntry = fileURLToPath(
    new URL(
        "../../node_modules/vscode-languageserver-types/lib/esm/main.js",
        import.meta.url
    )
);
const pwaThemeColor = "#097C87";
const pwaTileColor = "#097C87";
const pwaMaskIconColor = "#23CED9";
const footerCopyright =
    `© ${new Date().getFullYear()} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> 💻 Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">🦖 Docusaurus</a>.';

const suppressKnownWebpackWarningsPlugin = () => ({
    configureWebpack() {
        return {
            ignoreWarnings: [
                {
                    message:
                        /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/u,
                    module: /vscode-languageserver-types[\\/]lib[\\/]umd[\\/]main\.js/u,
                },
            ],
            resolve: {
                alias: {
                    "vscode-css-languageservice$":
                        vscodeCssLanguageServiceEsmEntry,
                    "vscode-languageserver-types$":
                        vscodeLanguageServerTypesEsmEntry,
                    "vscode-languageserver-types/lib/umd/main.js$":
                        vscodeLanguageServerTypesEsmEntry,
                },
            },
        };
    },
    name: "suppress-known-webpack-warnings",
});

const config: Config = {
    title: siteTitle,
    tagline: siteTagline,
    url: siteUrl,
    baseUrl,
    favicon: "img/favicon.ico",
    organizationName,
    projectName,
    deploymentBranch: "gh-pages",
    baseUrlIssueBanner: true,
    clientModules: [modernEnhancementsClientModule],
    future: {
        v4: {
            removeLegacyPostBuildHeadAttribute: true,
            useCssCascadeLayers: false,
        },
    },
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
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
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
                    path: "site-docs",
                    includeCurrentVersion: true,
                    onInlineTags: "ignore",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: false,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
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
                            label: "Overview",
                            to: "/docs/intro",
                        },
                        {
                            label: "Rules",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "Presets",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "API Reference",
                            to: "/docs/developer/api",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            href: `https://www.npmjs.com/package/eslint-plugin-write-good-comments-2`,
                            label: "npm",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/issues`,
                            label: "Issues",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "Releases",
                        },
                    ],
                    title: "Project",
                },
                {
                    items: [
                        {
                            to: "/docs/developer",
                            label: "Developer Notes",
                        },
                        {
                            to: "/docs/developer/api",
                            label: "TypeDoc API",
                        },
                        {
                            href: "https://github.com/retextjs",
                            label: "retext Ecosystem",
                        },
                    ],
                    title: "More",
                },
            ],
        },
        image: "img/logo.svg",
        metadata: [
            {
                content: siteTitle,
                name: "application-name",
            },
            {
                content: siteTagline,
                name: "description",
            },
        ],
        navbar: {
            hideOnScroll: false,
            items: [
                {
                    label: "Docs",
                    position: "left",
                    to: "/docs/intro",
                },
                {
                    label: "Rules",
                    position: "left",
                    to: "/docs/rules/overview",
                },
                {
                    label: "API",
                    position: "left",
                    to: "/docs/developer/api",
                },
                {
                    label: "Presets",
                    position: "left",
                    to: "/docs/rules/presets",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}/releases`,
                    label: "Releases",
                    position: "right",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
                {
                    href: `https://www.npmjs.com/package/eslint-plugin-write-good-comments-2`,
                    label: "npm",
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
    themes: ["@docusaurus/theme-mermaid"],
};

export default config;
