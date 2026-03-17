/**
 * @packageDocumentation
 * Synchronize or validate preset documentation tables from canonical plugin metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import builtPlugin from "../dist/plugin.js";
import { generateReadmeRulesSectionFromRules } from "./sync-readme-rules-table.mjs";

/** @typedef {import("../src/plugin").WriteGoodCommentsConfigName} PresetName */

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         docs?: { url?: string };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} PresetRuleModule
 */
/** @typedef {Readonly<Record<string, PresetRuleModule>>} PresetRulesMap */
/** @typedef {Readonly<{ changed: boolean }>} SyncResult */

const matrixSectionHeading = "## Rule matrix";
const presetRulesSectionHeading = "## Rules in this preset";
/** @type {Readonly<Record<PresetName, string>>} */
const presetDocPathByName = {
    all: "docs/rules/presets/all.md",
    recommended: "docs/rules/presets/recommended.md",
};
/** @type {readonly PresetName[]} */
const presetOrder = ["recommended", "all"];

/**
 * Normalize markdown table spacing for stable comparisons.
 *
 * @param {string} markdown - Markdown section text.
 *
 * @returns {string}
 */
const normalizeMarkdownTableSpacing = (markdown) =>
    markdown
        .replace(/\r\n/gv, "\n")
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trimEnd();

            if (!/^\|.*\|$/v.test(trimmedLine)) {
                return trimmedLine;
            }

            const cells = trimmedLine
                .split("|")
                .slice(1, -1)
                .map((cell) => {
                    const trimmedCell = cell.trim();

                    if (!/^:?-+:?$/v.test(trimmedCell)) {
                        return trimmedCell;
                    }

                    const hasStartColon = trimmedCell.startsWith(":");
                    const hasEndColon = trimmedCell.endsWith(":");

                    if (hasStartColon && hasEndColon) {
                        return ":-:";
                    }

                    if (hasStartColon) {
                        return ":--";
                    }

                    if (hasEndColon) {
                        return "--:";
                    }

                    return "---";
                });

            return `| ${cells.join(" | ")} |`;
        })
        .join("\n");

/**
 * Find the bounds of a markdown section by heading.
 *
 * @param {string} markdown - Full markdown document.
 * @param {string} heading - Section heading.
 *
 * @returns {{ headingOffset: number; sectionEndOffset: number }}
 */
const findSectionBoundsByHeading = (markdown, heading) => {
    const headingOffset = markdown.indexOf(heading);

    if (headingOffset < 0) {
        throw new Error(`Missing expected section heading '${heading}'.`);
    }

    const nextHeadingOffset = markdown.indexOf("\n## ", headingOffset + 1);

    return {
        headingOffset,
        sectionEndOffset:
            nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset + 1,
    };
};

/**
 * Replace one markdown section while preserving the rest of the document.
 *
 * @param {{ generatedSection: string; heading: string; markdown: string }} options
 *   - Replacement inputs.
 *
 * @returns {{ changed: boolean; nextMarkdown: string }}
 */
const replaceMarkdownSection = ({ generatedSection, heading, markdown }) => {
    const { headingOffset, sectionEndOffset } = findSectionBoundsByHeading(
        markdown,
        heading
    );
    const existingSection = markdown.slice(headingOffset, sectionEndOffset);

    if (
        normalizeMarkdownTableSpacing(existingSection) ===
        normalizeMarkdownTableSpacing(generatedSection)
    ) {
        return {
            changed: false,
            nextMarkdown: markdown,
        };
    }

    const markdownPrefix = markdown.slice(0, headingOffset).trimEnd();
    const markdownSuffix = markdown.slice(sectionEndOffset);

    return {
        changed: true,
        nextMarkdown: `${markdownPrefix}\n\n${generatedSection}${markdownSuffix}`,
    };
};

/**
 * Lookup one rule module from the built plugin.
 *
 * @param {string} ruleName - Unqualified rule id.
 *
 * @returns {PresetRuleModule}
 */
const getRuleModuleByName = (ruleName) => {
    const ruleModule = builtPlugin.rules[ruleName];

    if (typeof ruleModule !== "object" || ruleModule === null) {
        throw new TypeError(`Rule '${ruleName}' is missing from built plugin.`);
    }

    return /** @type {PresetRuleModule} */ (ruleModule);
};

/**
 * Convert rule metadata into a fix-indicator glyph.
 *
 * @param {PresetRuleModule} ruleModule - Rule metadata container.
 *
 * @returns {string}
 */
const getRuleFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

/**
 * Create a rules table for one preset page.
 *
 * @param {readonly string[]} ruleNames - Sorted preset rule names.
 *
 * @returns {string}
 */
const createPresetRulesTable = (ruleNames) =>
    [
        "| Rule | Fix |",
        "| --- | :-: |",
        ...ruleNames.map((ruleName) => {
            const ruleModule = getRuleModuleByName(ruleName);
            const docsUrl = ruleModule.meta?.docs?.url;

            if (typeof docsUrl !== "string") {
                throw new TypeError(
                    `Rule '${ruleName}' is missing meta.docs.url.`
                );
            }

            return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} |`;
        }),
    ].join("\n");

/**
 * Generate the rules section for one preset page.
 *
 * @param {PresetName} presetName - Preset to document.
 *
 * @returns {string}
 */
const generatePresetRulesSection = (presetName) => {
    const preset = builtPlugin.configs[presetName];
    const ruleNames = Object.keys(preset.rules)
        .filter((ruleId) => ruleId.startsWith("write-good-comments/"))
        .map((ruleId) => ruleId.slice("write-good-comments/".length))
        .toSorted((left, right) => left.localeCompare(right));

    return [
        presetRulesSectionHeading,
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "",
        createPresetRulesTable(ruleNames),
        "",
    ].join("\n");
};

/**
 * Generate the canonical presets-index rule matrix section.
 *
 * @param {PresetRulesMap} rules - Canonical rule metadata map.
 *
 * @returns {string}
 */
export const generatePresetsRulesMatrixSectionFromRules = (rules) => {
    const readmeRulesSection = generateReadmeRulesSectionFromRules(rules)
        .replace(/\r\n/gv, "\n")
        .split("\n");

    return [
        matrixSectionHeading,
        "",
        ...readmeRulesSection.slice(2),
    ].join("\n");
};

/**
 * Validate or update the presets index matrix section.
 *
 * @param {{ workspaceRoot: string; writeChanges: boolean }} options - Execution
 *   mode flags.
 *
 * @returns {Promise<SyncResult>}
 */
const syncPresetsRulesMatrixSection = async ({
    workspaceRoot,
    writeChanges,
}) => {
    const presetsIndexPath = resolve(
        workspaceRoot,
        "docs/rules/presets/index.md"
    );
    const presetsIndexMarkdown = await readFile(presetsIndexPath, "utf8");
    const generatedSection = generatePresetsRulesMatrixSectionFromRules(
        /** @type {PresetRulesMap} */ (builtPlugin.rules)
    );
    const replacementResult = replaceMarkdownSection({
        generatedSection,
        heading: matrixSectionHeading,
        markdown: presetsIndexMarkdown,
    });

    if (!replacementResult.changed) {
        return { changed: false };
    }

    if (writeChanges) {
        await writeFile(
            presetsIndexPath,
            replacementResult.nextMarkdown,
            "utf8"
        );
    }

    return { changed: true };
};

/**
 * Validate or update each preset page's rule table.
 *
 * @param {{ workspaceRoot: string; writeChanges: boolean }} options - Execution
 *   mode flags.
 *
 * @returns {Promise<SyncResult>}
 */
const syncPresetPageRuleTables = async ({ workspaceRoot, writeChanges }) => {
    let changed = false;

    for (const presetName of presetOrder) {
        const presetDocPath = resolve(
            workspaceRoot,
            presetDocPathByName[presetName]
        );
        const presetMarkdown = await readFile(presetDocPath, "utf8");
        const generatedSection = generatePresetRulesSection(presetName);
        const replacementResult = replaceMarkdownSection({
            generatedSection,
            heading: presetRulesSectionHeading,
            markdown: presetMarkdown,
        });

        if (!replacementResult.changed) {
            continue;
        }

        changed = true;

        if (writeChanges) {
            await writeFile(
                presetDocPath,
                replacementResult.nextMarkdown,
                "utf8"
            );
        }
    }

    return { changed };
};

/**
 * Validate or update all preset documentation rule tables.
 *
 * @param {{ writeChanges: boolean }} options - Execution mode flags.
 *
 * @returns {Promise<SyncResult>}
 */
const syncPresetsDocs = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const presetsMatrixResult = await syncPresetsRulesMatrixSection({
        workspaceRoot,
        writeChanges,
    });
    const presetPageTablesResult = await syncPresetPageRuleTables({
        workspaceRoot,
        writeChanges,
    });

    return {
        changed: presetsMatrixResult.changed || presetPageTablesResult.changed,
    };
};

/** @returns {Promise<void>} */
const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncPresetsDocs({ writeChanges });

    if (!result.changed) {
        console.log("Preset rule tables are already synchronized.");
        return;
    }

    if (writeChanges) {
        console.log("Preset rule tables synchronized from plugin metadata.");
        return;
    }

    console.error(
        "Preset rule tables are out of sync. Run: npm run sync:presets-rules-matrix -- --write"
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await runCli();
}
