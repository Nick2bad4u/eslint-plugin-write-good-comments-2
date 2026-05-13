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
    // Add repository-specific config entries below as needed.
];

export default config;
