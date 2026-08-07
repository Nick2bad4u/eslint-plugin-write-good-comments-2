/**
 * Repository-specific configuration for Knip dependency analysis.
 *
 * @packageDocumentation
 */
import type { KnipConfig } from "knip";

/**
 * Knip configuration that scopes entry points and dependency heuristics to the
 * repository layout.
 */
const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip@6/schema.json",
    ignore: [
        // Type declarations paired with JavaScript entry points resolved by TypeScript.
        "plugin.d.mts",
        "scripts/sync-presets-rules-matrix.d.mts",
        "scripts/sync-readme-rules-table.d.mts",
    ],
    ignoreBinaries: [
        "actionlint",
        "gitleaks",
        "grype",
        "lychee",
    ],
    ignoreDependencies: [
        // Dictionary entry points are deliberately resolved from option strings at runtime.
        "@cspell/dict-*",
        // The shared Stylelint config owns and resolves its plugin dependencies.
        "@double-great/stylelint-a11y",
        "@stylistic/stylelint-plugin",
        // These shared configurations are consumed through CLI arguments or non-JavaScript config files.
        "gitcliff-config-nick2bad4u",
        "gitleaks-config-nick2bad4u",
        "jscpd-config-nick2bad4u",
        "lychee-config-nick2bad4u",
        "ncu-config-nick2bad4u",
        // The root TypeScript settings cover the docs workspace; that workspace owns React.
        "react",
        "tsdoc-config-nick2bad4u",
        "yamllint-config-nick2bad4u",
    ],
    ignoreExportsUsedInFile: {
        interface: true,
        type: true,
    },
    ignoreUnresolved: [
        // The shared Stylelint config owns and resolves its syntax and rule dependencies.
        "postcss-*",
        "stylelint-*",
    ],
    rules: {
        binaries: "error",
        dependencies: "error",
        devDependencies: "error",
        duplicates: "error",
        enumMembers: "warn",
        exports: "warn",
        files: "error",
        nsExports: "warn",
        nsTypes: "warn",
        optionalPeerDependencies: "error",
        types: "warn",
        unlisted: "error",
        unresolved: "error",
    },
    workspaces: {
        ".": {
            entry: [
                ".secretlintrc.cjs",
                "scripts/*.mjs",
                "vitest.stryker.config.ts",
            ],
        },
        "docs/docusaurus": {
            ignoreDependencies: [
                // Docusaurus loads themes and Mermaid support from configuration strings.
                "@easyops-cn/docusaurus-search-local",
                "@easyops-cn/docusaurus-theme-docusaurus-search-local",
                "mermaid",
                "mermaid-config-nick2bad4u",
                "typedoc-config-nick2bad4u",
            ],
        },
    },
};

export default knipConfig;
