import nickTwoBadFourU from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

/** @type {NonNullable<import("eslint").Linter.Config["rules"]>} */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Plugin runtime rules are validated by ESLint's plugin contract.
const localPluginRules = {
    // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
    ...plugin.configs.all.rules,
};

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.withoutWriteGoodComments2,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Write Good Comments",
        plugins: {
            "write-good-comments": plugin,
        },
        rules: {
            ...localPluginRules,

            "write-good-comments/inclusive-language-comments": "off",
            "write-good-comments/no-profane-comments": "off",
            "write-good-comments/readability-comments": "off",
            "write-good-comments/spellcheck-comments": "off",
            "write-good-comments/task-comment-format": "off",
            "write-good-comments/write-good-comments": "off",
        },
    },
    {
        files: ["commitlint.config.mjs"],
        name: "Repository JS Config Exceptions",
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "jsdoc/no-undefined-types": "off",
        },
    },
    {
        files: ["package.json", "docs/docusaurus/package.json"],
        name: "Deterministic package metadata lint",
        rules: {
            // This rule performs npm registry lookups during lint. Keep release
            // verification deterministic; dependency freshness is handled by
            // the explicit update flow.
            "node-dependencies/no-deprecated": "off",
        },
    },
    {
        files: ["scripts/**/*.mjs"],
        name: "Repository Script JSDoc Exceptions",
        rules: {
            "jsdoc/check-tag-names": "off",
            "jsdoc/informative-docs": "off",
            "jsdoc/match-description": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/reject-any-type": "off",
            "jsdoc/require-throws": "off",
        },
    },
    {
        files: ["**/*.d.ts"],
        name: "Declaration File Exceptions",
        rules: {
            "import-x/unambiguous": "off",
            "unicorn/require-module-specifiers": "off",
        },
    },
    {
        files: ["src/_internal/retext.ts"],
        name: "Retext Interop Exceptions",
        rules: {
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "import-x/no-rename-default": "off",
        },
    },
    {
        files: [
            "src/_internal/spellcheck-cspell.ts",
            "src/rules/spellcheck-comments.ts",
        ],
        name: "Spellcheck Naming And Runtime Compatibility",
        rules: {
            "unicorn/consistent-boolean-name": "off",
            "unicorn/prefer-error-is-error": "off",
        },
    },
    {
        files: ["src/plugin.ts"],
        name: "Plugin Contract Interop Exceptions",
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
        },
    },
    {
        files: ["src/_internal/default-export.ts"],
        name: "Default Export Interop Exceptions",
        rules: {
            "@typescript-eslint/no-unsafe-type-assertion": "off",
        },
    },
    {
        files: ["test/_internal/ruleTester.ts"],
        name: "RuleTester Vitest Interop Exceptions",
        rules: {
            "@typescript-eslint/strict-void-return": "off",
        },
    },
    {
        files: ["knip.config.ts", "vitest.stryker.config.ts"],
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: [
                        "knip.config.ts",
                        "vitest.stryker.config.ts",
                    ],
                },
            },
        },
        name: "Typed Config And Tooling Project Service Exceptions",
    },
    {
        files: ["stryker.config.mjs"],
        name: "Stryker Runtime Config Exceptions",
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
        },
    },
    {
        files: ["docs/docusaurus/docusaurus.config.ts"],
        name: "Docusaurus Config Framework Exceptions",
        rules: {
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "n/no-process-env": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-temporal": "off",
        },
    },
    {
        files: [
            "docs/docusaurus/blog/**/*.md",
            "docs/docusaurus/site-docs/**/*.md",
            "docs/rules/**/*.md",
        ],
        name: "Docusaurus Markdown frontmatter titles",
        rules: {
            "markdown/no-multiple-h1": "off",
        },
    },
    {
        files: [
            "docs/docusaurus/src/**/*.jsx",
            "docs/docusaurus/src/pages/index.jsx",
        ],
        name: "Docusaurus Source Naming Exceptions",
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "canonical/filename-no-index": "off",
            "unicorn/filename-case": "off",
        },
    },
    {
        files: ["docs/docusaurus/static/manifest.json"],
        name: "Docusaurus web app manifest",
        rules: {
            // This is a web app manifest, not a browser extension manifest.
            "json-schema-validator-2/no-invalid": "off",
        },
    },
    {
        files: [
            "test/configs.test.ts",
            "test/docs-integrity.test.ts",
            "test/docs-site-config-integrity.test.ts",
            "test/plugin-entry.test.ts",
            "test/presets-rules-matrix-sync.test.ts",
            "test/readme-rules-table-sync.test.ts",
            "test/rule-metadata-integrity.test.ts",
        ],
        name: "Integrity Test Signal Exceptions",
        rules: {
            "test-signal/require-negative-path": "off",
        },
    },
    {
        files: ["docs/docusaurus/typedoc.config.json"],
        name: "TypeDoc config schema availability",
        rules: {
            // Json-schema-validator-2 fetches the remote TypeDoc schema during
            // lint. TypeDoc validates this config during docs verification.
            "json-schema-validator-2/no-invalid": "off",
        },
    },
    {
        files: ["docs/docusaurus/site-docs/developer/index.md"],
        name: "Generated API Link Compatibility",
        rules: {
            // The API index is generated by TypeDoc during the docs build.
            "remark/remark": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
