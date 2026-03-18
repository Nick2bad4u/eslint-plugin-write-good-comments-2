/**
 * @packageDocumentation
 * Documentation contract tests for shipped markdown pages.
 */

import { access, readFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { describe, expect, it } from "vitest";

import { parseMarkdownHeadingsAtLevel } from "./_internal/markdown-headings";

const workspaceRoot = process.cwd();
const expectedRuleDocH2Headings = [
    "✅ Correct",
    "❌ Incorrect",
    "Additional examples",
    "Behavior and migration notes",
    "ESLint flat config example",
    "Further reading",
    "Package documentation",
    "Targeted pattern scope",
    "What this rule reports",
    "When not to use it",
    "Why this rule exists",
];

expectedRuleDocH2Headings.sort((left, right) => left.localeCompare(right));
const ruleDocs = [
    {
        catalogId: "R001",
        path: nodePath.resolve(
            workspaceRoot,
            "docs/rules/write-good-comments.md"
        ),
        ruleName: "write-good-comments",
    },
    {
        catalogId: "R002",
        path: nodePath.resolve(
            workspaceRoot,
            "docs/rules/task-comment-format.md"
        ),
        ruleName: "task-comment-format",
    },
    {
        catalogId: "R003",
        path: nodePath.resolve(
            workspaceRoot,
            "docs/rules/inclusive-language-comments.md"
        ),
        ruleName: "inclusive-language-comments",
    },
    {
        catalogId: "R004",
        path: nodePath.resolve(
            workspaceRoot,
            "docs/rules/no-profane-comments.md"
        ),
        ruleName: "no-profane-comments",
    },
    {
        catalogId: "R005",
        path: nodePath.resolve(
            workspaceRoot,
            "docs/rules/spellcheck-comments.md"
        ),
        ruleName: "spellcheck-comments",
    },
    {
        catalogId: "R006",
        path: nodePath.resolve(
            workspaceRoot,
            "docs/rules/readability-comments.md"
        ),
        ruleName: "readability-comments",
    },
] as const;
const docsFiles = {
    overview: nodePath.resolve(workspaceRoot, "docs/rules/overview.md"),
    presetsIndex: nodePath.resolve(
        workspaceRoot,
        "docs/rules/presets/index.md"
    ),
    siteGettingStarted: nodePath.resolve(
        workspaceRoot,
        "docs/docusaurus/site-docs/getting-started.md"
    ),
    siteIntro: nodePath.resolve(
        workspaceRoot,
        "docs/docusaurus/site-docs/intro.md"
    ),
};

describe("docs integrity", () => {
    it("keeps core documentation files present", async () => {
        await expect(
            Promise.all(
                [
                    ...Object.values(docsFiles),
                    ...ruleDocs.map((ruleDoc) => ruleDoc.path),
                ].map(async (fileUrl) => access(fileUrl))
            )
        ).resolves.toHaveLength(
            Object.keys(docsFiles).length + ruleDocs.length
        );
    });

    it("ships the expected rule-doc heading structure", async () => {
        for (const ruleDoc of ruleDocs) {
            const ruleDocMarkdown = await readFile(ruleDoc.path, "utf8");
            const h1Headings = parseMarkdownHeadingsAtLevel(ruleDocMarkdown, 1);
            const h2Headings = new Set(
                parseMarkdownHeadingsAtLevel(ruleDocMarkdown, 2)
            );

            expect(h1Headings).toStrictEqual([ruleDoc.ruleName]);
            expect(h2Headings).toEqual(new Set(expectedRuleDocH2Headings));
            expect(ruleDocMarkdown).toContain(
                `> **Rule catalog ID:** ${ruleDoc.catalogId}`
            );
        }
    });

    it("keeps the site overview pages branded for write-good-comments", async () => {
        const [introMarkdown, gettingStartedMarkdown] = await Promise.all([
            readFile(docsFiles.siteIntro, "utf8"),
            readFile(docsFiles.siteGettingStarted, "utf8"),
        ]);

        expect(introMarkdown).toContain(
            "# eslint-plugin-write-good-comments-2"
        );
        expect(gettingStartedMarkdown).toContain(
            "npm install --save-dev eslint-plugin-write-good-comments-2"
        );
    });
});
