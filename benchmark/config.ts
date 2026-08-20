/**
 * @packageDocumentation
 * Focused performance benchmarks for every public comment rule.
 */

import { defineConfig, type UserBenchmarkConfig } from "eslint-rule-benchmark";

const representativeCase = {
    testPath: "./cases/write-good-comments/representative.ts",
} as const;

const config: UserBenchmarkConfig = defineConfig({
    iterations: 25,
    tests: [
        {
            cases: [representativeCase],
            name: "Inclusive language comments",
            ruleId: "write-good-comments/inclusive-language-comments",
            rulePath: "../src/rules/inclusive-language-comments.ts",
        },
        {
            cases: [representativeCase],
            name: "Profanity in comments",
            ruleId: "write-good-comments/no-profane-comments",
            rulePath: "../src/rules/no-profane-comments.ts",
        },
        {
            cases: [representativeCase],
            name: "Comment readability",
            ruleId: "write-good-comments/readability-comments",
            rulePath: "../src/rules/readability-comments.ts",
        },
        {
            cases: [representativeCase],
            name: "Comment spellchecking",
            ruleId: "write-good-comments/spellcheck-comments",
            rulePath: "../src/rules/spellcheck-comments.ts",
        },
        {
            cases: [representativeCase],
            name: "Task comment formatting",
            ruleId: "write-good-comments/task-comment-format",
            rulePath: "../src/rules/task-comment-format.ts",
        },
        {
            cases: [representativeCase],
            name: "Write-good comment style",
            ruleId: "write-good-comments/write-good-comments",
            rulePath: "../src/rules/write-good-comments.ts",
        },
    ],
    timeout: 5000,
    warmup: {
        enabled: true,
        iterations: 5,
    },
});

export default config;
