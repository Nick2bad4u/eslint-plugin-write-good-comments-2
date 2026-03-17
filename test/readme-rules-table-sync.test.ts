/**
 * @packageDocumentation
 * README rules-table sync tests.
 */

import { readFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { describe, expect, it } from "vitest";

import plugin from "../dist/plugin.js";
import {
    extractReadmeRulesSection,
    generateReadmeRulesSectionFromRules,
    normalizeRulesSectionMarkdown,
} from "../scripts/sync-readme-rules-table.mjs";

const workspaceRoot = process.cwd();

describe("rEADME rules table sync", () => {
    it("matches the canonical generated rules table", async () => {
        const readmeMarkdown = await readFile(
            nodePath.resolve(workspaceRoot, "README.md"),
            "utf8"
        );
        const existingRulesSection = extractReadmeRulesSection(readmeMarkdown);
        const generatedRulesSection = generateReadmeRulesSectionFromRules(
            plugin.rules as Parameters<
                typeof generateReadmeRulesSectionFromRules
            >[0]
        );

        expect(normalizeRulesSectionMarkdown(existingRulesSection)).toBe(
            normalizeRulesSectionMarkdown(generatedRulesSection)
        );
    });
});
