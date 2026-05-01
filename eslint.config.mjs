import nick2bad4u from "eslint-config-nick2bad4u";

import writeGoodComments from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutWriteGoodComments2,

    // Local Plugin Config
    // This lets us use the plugin's rules in this repository without needing to publish the plugin first.
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Write Good Comments",
        plugins: {
            "write-good-comments": writeGoodComments,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...writeGoodComments.configs.all.rules,

            "write-good-comments/inclusive-language-comments": "off",
            "write-good-comments/no-profane-comments": "off",
            "write-good-comments/readability-comments": "off",
            "write-good-comments/spellcheck-comments": "off",
            "write-good-comments/task-comment-format": "off",
            "write-good-comments/write-good-comments": "off",
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
