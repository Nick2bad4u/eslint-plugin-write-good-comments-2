/**
 * @packageDocumentation
 * Preset docs sync tests.
 */

import { readFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { describe, expect, it } from "vitest";

import plugin from "../dist/plugin.js";
import { normalizeRulesSectionMarkdown } from "../scripts/sync-readme-rules-table.mjs";
import { generatePresetsRulesMatrixSectionFromRules } from "../scripts/sync-presets-rules-matrix.mjs";

const workspaceRoot = process.cwd();

const extractSectionByHeading = (markdown: string, heading: string): string => {
    const startOffset = markdown.indexOf(heading);

    if (startOffset === -1) {
        throw new Error(`Missing heading '${heading}'.`);
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + heading.length
    );

    return markdown
        .slice(
            startOffset,
            nextHeadingOffset === -1 ? markdown.length : nextHeadingOffset
        )
        .trimEnd();
};

describe("preset docs matrix sync", () => {
    it("matches the canonical generated preset rules matrix", async () => {
        const presetsIndexMarkdown = await readFile(
            nodePath.resolve(workspaceRoot, "docs/rules/presets/index.md"),
            "utf8"
        );
        const existingMatrixSection = extractSectionByHeading(
            presetsIndexMarkdown,
            "## Rule matrix"
        );
        const generatedMatrixSection =
            generatePresetsRulesMatrixSectionFromRules(
                plugin.rules as Parameters<
                    typeof generatePresetsRulesMatrixSectionFromRules
                >[0]
            );

        expect(normalizeRulesSectionMarkdown(existingMatrixSection)).toBe(
            normalizeRulesSectionMarkdown(generatedMatrixSection)
        );
    });
});
