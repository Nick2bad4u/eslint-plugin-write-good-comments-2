/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical plugin metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import builtPlugin from "../dist/plugin.js";

/** @typedef {import("../src/plugin").WriteGoodCommentsConfigName} PresetName */

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         docs?: { url?: string };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} ReadmeRuleModule
 */
/** @typedef {Readonly<Record<string, ReadmeRuleModule>>} ReadmeRulesMap */
/** @typedef {Readonly<{ changed: boolean }>} SyncResult */

/** @type {readonly PresetName[]} */
const presetOrder = ["recommended", "all"];
const rulesSectionHeading = "## Rules";
/** @type {Readonly<Record<PresetName, string>>} */
const presetDocsUrlByName = {
    all: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/all",
    recommended:
        "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/presets/recommended",
};
/** @type {Readonly<Record<PresetName, string>>} */
const presetIconByName = {
    all: "🟣",
    recommended: "🟡",
};
/** @type {Readonly<Record<PresetName, string>>} */
const presetReferenceByName = {
    all: "writeGoodComments.configs.all",
    recommended: "writeGoodComments.configs.recommended",
};

/**
 * Locate the README rules-section bounds.
 *
 * @param {string} markdown - Full README markdown.
 *
 * @returns {{ endOffset: number; startOffset: number }}
 */
const getReadmeRulesSectionBounds = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);

    if (startOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

/**
 * Extract the README rules section.
 *
 * @param {string} markdown - Full README markdown.
 *
 * @returns {string}
 */
export const extractReadmeRulesSection = (markdown) => {
    const { endOffset, startOffset } = getReadmeRulesSectionBounds(markdown);

    return markdown.slice(startOffset, endOffset);
};

/**
 * Normalize markdown table spacing to compare generated and checked-in
 * sections.
 *
 * @param {string} markdown - Markdown section text.
 *
 * @returns {string}
 */
export const normalizeRulesSectionMarkdown = (markdown) =>
    markdown
        .replaceAll("\r\n", "\n")
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
        .join("\n")
        .trimEnd();

/**
 * Convert rule metadata into a fix-indicator glyph.
 *
 * @param {ReadmeRuleModule} ruleModule - Rule metadata container.
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
 * Map each rule name to the presets that enable it.
 *
 * @returns {Map<string, PresetName[]>}
 */
const collectPresetNamesByRuleName = () => {
    /** @type {Map<string, PresetName[]>} */
    const presetNamesByRuleName = new Map();

    for (const presetName of presetOrder) {
        const preset = builtPlugin.configs[presetName];
        const ruleNames = Object.keys(preset.rules)
            .filter((ruleId) => ruleId.startsWith("write-good-comments/"))
            .map((ruleId) => ruleId.slice("write-good-comments/".length));

        for (const ruleName of ruleNames) {
            const presetNames = presetNamesByRuleName.get(ruleName) ?? [];

            presetNames.push(presetName);
            presetNamesByRuleName.set(ruleName, presetNames);
        }
    }

    return presetNamesByRuleName;
};

/** @returns {readonly string[]} */
const createPresetLegendLines = () =>
    presetOrder.map((presetName) => {
        const docsUrl = presetDocsUrlByName[presetName];
        const presetIcon = presetIconByName[presetName];
        const configReference = presetReferenceByName[presetName];

        return `  - [${presetIcon}](${docsUrl}) — [\`${configReference}\`](${docsUrl})`;
    });

/**
 * Format one README rules-table row.
 *
 * @param {[string, ReadmeRuleModule]} ruleEntry - Rule name and metadata.
 * @param {Map<string, PresetName[]>} presetNamesByRuleName - Preset membership
 *   index.
 *
 * @returns {string}
 */
const toRuleTableRow = ([ruleName, ruleModule], presetNamesByRuleName) => {
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    const presetNames = presetNamesByRuleName.get(ruleName) ?? [];
    const presetIcons = presetNames.map(
        (presetName) =>
            `[${presetIconByName[presetName]}](${presetDocsUrlByName[presetName]})`
    );

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} | ${presetIcons.join(" ")} |`;
};

/**
 * Generate the canonical README rules section from plugin metadata.
 *
 * @param {ReadmeRulesMap} rules - Canonical rule metadata map.
 *
 * @returns {string}
 */
export const generateReadmeRulesSectionFromRules = (rules) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );
    const presetNamesByRuleName = collectPresetNamesByRuleName();
    const rows = ruleEntries.map((entry) =>
        toRuleTableRow(entry, presetNamesByRuleName)
    );

    return [
        "## Rules",
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "- `Preset key` legend:",
        ...createPresetLegendLines(),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-- |",
        ...rows,
        "",
    ].join("\n");
};

/**
 * Validate or update the checked-in README rules table.
 *
 * @param {{ writeChanges: boolean }} options - Execution mode flags.
 *
 * @returns {Promise<SyncResult>}
 */
export const syncReadmeRulesTable = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const readmePath = resolve(workspaceRoot, "README.md");
    const readmeText = await readFile(readmePath, "utf8");

    const { endOffset, startOffset } = getReadmeRulesSectionBounds(readmeText);
    const readmePrefix = readmeText.slice(0, startOffset).trimEnd();
    const readmeSuffix = readmeText.slice(endOffset);
    const generatedRulesSection = generateReadmeRulesSectionFromRules(
        /** @type {ReadmeRulesMap} */ (builtPlugin.rules)
    );
    const existingRulesSection = extractReadmeRulesSection(readmeText);

    if (
        normalizeRulesSectionMarkdown(existingRulesSection) ===
        normalizeRulesSectionMarkdown(generatedRulesSection)
    ) {
        return {
            changed: false,
        };
    }

    const nextReadmeText = `${readmePrefix}\n\n${generatedRulesSection}${readmeSuffix}`;

    if (!writeChanges) {
        return {
            changed: true,
        };
    }

    await writeFile(readmePath, nextReadmeText, "utf8");

    return {
        changed: true,
    };
};

/** @returns {Promise<void>} */
const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncReadmeRulesTable({ writeChanges });

    if (!result.changed) {
        console.log("README rules table is already synchronized.");

        return;
    }

    if (writeChanges) {
        console.log("README rules table synchronized from plugin metadata.");

        return;
    }

    console.error(
        "README rules table is out of sync. Run: npm run sync:readme-rules-table:write (or npm run sync:readme-rules-table:update to refresh snapshots too)."
    );
    process.exitCode = 1;
};

if (
    typeof process.argv[1] === "string" &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await runCli();
}
