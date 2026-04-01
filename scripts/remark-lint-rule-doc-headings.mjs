/**
 * @file Remark lint plugin enforcing canonical H2 heading order for helper
 *   docs.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** @typedef {import("mdast").Heading} Heading */
/** @typedef {import("mdast").Root} Root */
/** @typedef {import("unist").Node} Node */
/** @typedef {import("vfile").VFile} VFile */
/** @typedef {{ name?: unknown }} PackageMetadata */
/** @typedef {boolean | undefined} HeadingToggle */

/**
 * @typedef {{
 *     headings?: Partial<Record<string, HeadingToggle>>;
 *     helperDocPathPattern?: RegExp;
 *     requirePackageDocumentation?: boolean;
 *     requirePackageDocumentationLabel?: boolean;
 *     packageDocumentationLabelPattern?: RegExp;
 *     ruleCatalogIdLinePattern?: RegExp;
 *     ruleNamespaceAliases?: readonly string[];
 * }} RemarkLintRuleDocHeadingsOptions
 */

const canonicalHeadingDefinitions = [
    {
        heading: "Targeted pattern scope",
        key: "targetedPatternScope",
        requiredByDefault: true,
    },
    {
        heading: "What this rule reports",
        key: "whatThisRuleReports",
        requiredByDefault: true,
    },
    {
        heading: "Why this rule exists",
        key: "whyThisRuleExists",
        requiredByDefault: true,
    },
    { heading: "❌ Incorrect", key: "incorrect", requiredByDefault: true },
    { heading: "✅ Correct", key: "correct", requiredByDefault: true },
    { heading: "Deprecated", key: "deprecated", requiredByDefault: false },
    {
        heading: "Behavior and migration notes",
        key: "behaviorAndMigrationNotes",
        requiredByDefault: false,
    },
    {
        heading: "Additional examples",
        key: "additionalExamples",
        requiredByDefault: false,
    },
    {
        heading: "ESLint flat config example",
        key: "eslintFlatConfigExample",
        requiredByDefault: false,
    },
    {
        heading: "When not to use it",
        key: "whenNotToUseIt",
        requiredByDefault: false,
    },
    {
        heading: "Package documentation",
        key: "packageDocumentation",
        requiredByDefault: false,
    },
    {
        heading: "Further reading",
        key: "furtherReading",
        requiredByDefault: true,
    },
    {
        heading: "Adoption resources",
        key: "adoptionResources",
        requiredByDefault: false,
    },
];

const optionalDetailHeadingDefinitions = [
    { heading: "Matched patterns", key: "matchedPatterns" },
    { heading: "Detection boundaries", key: "detectionBoundaries" },
];

const canonicalHeadingOrder = canonicalHeadingDefinitions.map(
    (definition) => definition.heading
);

const canonicalHeadingDefinitionsByTitle = new Map(
    canonicalHeadingDefinitions.map((definition) => [
        definition.heading,
        definition,
    ])
);

const optionalDetailHeadingDefinitionsByTitle = new Map(
    optionalDetailHeadingDefinitions.map((definition) => [
        definition.heading,
        definition,
    ])
);

const defaultHeadingToggles = Object.freeze(
    Object.fromEntries(
        [
            ...canonicalHeadingDefinitions,
            ...optionalDetailHeadingDefinitions,
        ].map((definition) => [definition.key, true])
    )
);

const optionalDetailAllowedParentHeadings = new Set([
    "Targeted pattern scope",
    "What this rule reports",
]);

const defaultRuleCatalogIdLinePattern = /^> \*\*Rule catalog ID:\*\* R\d{3}$/u;
const defaultPackageDocumentationLabelPattern =
    /^[^\r\n]+ package documentation:$/mu;
const eslintPluginPackagePrefix = "eslint-plugin-";
const helperDocDirectoryName = "docs";
const helperDocSubdirectoryName = "rules";
const excludedHelperDocFileNames = new Set([
    "getting-started.md",
    "overview.md",
]);

const packageMetadataCache = new Map();

/**
 * @param {readonly string[]} traversedDirectories
 * @param {PackageMetadata | undefined} packageMetadata
 */
const cachePackageMetadata = (traversedDirectories, packageMetadata) => {
    for (const traversedDirectory of traversedDirectories) {
        packageMetadataCache.set(traversedDirectory, packageMetadata);
    }
};

/**
 * @param {string} packageJsonPath
 *
 * @returns {PackageMetadata | undefined}
 */
const readPackageMetadata = (packageJsonPath) => {
    try {
        return /** @type {PackageMetadata} */ (
            JSON.parse(readFileSync(packageJsonPath, "utf8"))
        );
    } catch {
        return undefined;
    }
};

/**
 * @param {string} normalizedPath
 *
 * @returns {boolean}
 */
const isDefaultHelperDocPath = (normalizedPath) => {
    const pathSegments = normalizedPath.split("/");
    const docsIndex = pathSegments.lastIndexOf(helperDocDirectoryName);

    if (
        docsIndex === -1 ||
        pathSegments[docsIndex + 1] !== helperDocSubdirectoryName
    ) {
        return false;
    }

    const relativeSegments = pathSegments.slice(docsIndex + 2);

    if (relativeSegments.length !== 1) {
        return false;
    }

    const fileName = relativeSegments[0];

    if (typeof fileName !== "string") {
        return false;
    }

    return (
        fileName.endsWith(".md") && !excludedHelperDocFileNames.has(fileName)
    );
};

/**
 * @param {string} documentPath
 *
 * @returns {PackageMetadata | undefined}
 */
const getNearestPackageMetadata = (documentPath) => {
    const traversedDirectories = [];
    let currentDirectory = dirname(documentPath);

    while (true) {
        traversedDirectories.push(currentDirectory);

        if (packageMetadataCache.has(currentDirectory)) {
            const cachedPackageMetadata =
                packageMetadataCache.get(currentDirectory);

            cachePackageMetadata(traversedDirectories, cachedPackageMetadata);

            return cachedPackageMetadata;
        }

        const packageJsonPath = join(currentDirectory, "package.json");

        if (existsSync(packageJsonPath)) {
            const packageMetadata = readPackageMetadata(packageJsonPath);

            cachePackageMetadata(traversedDirectories, packageMetadata);

            return packageMetadata;
        }

        const parentDirectory = dirname(currentDirectory);

        if (parentDirectory === currentDirectory) {
            cachePackageMetadata(traversedDirectories, undefined);

            return undefined;
        }

        currentDirectory = parentDirectory;
    }
};

/**
 * @param {unknown} packageName
 *
 * @returns {packageName is string}
 */
const isPackageName = (packageName) => typeof packageName === "string";

/**
 * @param {string} packageName
 *
 * @returns {readonly string[]}
 */
const getRuleNamespaceAliasesFromPackageName = (packageName) => {
    const aliases = new Set();

    if (packageName.startsWith(eslintPluginPackagePrefix)) {
        const pluginName = packageName.slice(eslintPluginPackagePrefix.length);

        if (pluginName !== "") {
            aliases.add(pluginName);
        }

        return [...aliases];
    }

    if (!packageName.startsWith("@")) {
        return [...aliases];
    }

    const packageSeparatorIndex = packageName.indexOf("/");

    if (packageSeparatorIndex === -1) {
        return [...aliases];
    }

    const packageScope = packageName.slice(0, packageSeparatorIndex);
    const scopedPackageName = packageName.slice(packageSeparatorIndex + 1);

    if (!scopedPackageName.startsWith(eslintPluginPackagePrefix)) {
        return [...aliases];
    }

    const pluginName = scopedPackageName.slice(
        eslintPluginPackagePrefix.length
    );

    if (pluginName !== "") {
        aliases.add(pluginName);
        aliases.add(`${packageScope}/${pluginName}`);
    }

    return [...aliases];
};

/**
 * @param {string} fileRuleId
 * @param {readonly string[]} ruleNamespaceAliases
 *
 * @returns {readonly string[]}
 */
const getExpectedH1Titles = (fileRuleId, ruleNamespaceAliases) => {
    const expectedH1Titles = new Set([fileRuleId]);

    if (fileRuleId.startsWith("typescript-")) {
        expectedH1Titles.add(`typescript/${fileRuleId.slice(11)}`);
    }

    for (const ruleNamespaceAlias of ruleNamespaceAliases) {
        expectedH1Titles.add(`${ruleNamespaceAlias}/${fileRuleId}`);
    }

    return [...expectedH1Titles];
};

/**
 * @param {string} path
 *
 * @returns {string}
 */
const normalizePath = (path) => path.replaceAll("\\", "/");

/**
 * @param {string} normalizedPath
 * @param {RegExp | undefined} helperDocPathPattern
 *
 * @returns {boolean}
 */
const isHelperDocPath = (normalizedPath, helperDocPathPattern) =>
    helperDocPathPattern instanceof RegExp
        ? helperDocPathPattern.test(normalizedPath)
        : isDefaultHelperDocPath(normalizedPath);

/**
 * @param {readonly string[]} values
 *
 * @returns {string}
 */
const formatInlineCodeList = (values) =>
    values.map((value) => `\`${value}\``).join(", ");

/**
 * @param {unknown} value
 *
 * @returns {value is { value: string }}
 */
const hasValue = (value) =>
    typeof value === "object" && value !== null && "value" in value;

/**
 * @param {unknown} value
 *
 * @returns {value is { children: unknown[] }}
 */
const hasChildren = (value) =>
    typeof value === "object" && value !== null && "children" in value;

/**
 * @param {unknown} node
 *
 * @returns {string}
 */
const getNodeText = (node) => {
    if (hasValue(node) && typeof node.value === "string") {
        return node.value;
    }

    if (hasChildren(node) && Array.isArray(node.children)) {
        return node.children.map((child) => getNodeText(child)).join("");
    }

    return "";
};

/**
 * @param {unknown} value
 *
 * @returns {value is Root}
 */
const isRootNode = (value) =>
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "root" &&
    "children" in value &&
    Array.isArray(value.children);

/**
 * @param {unknown} node
 *
 * @returns {node is Heading}
 */
const isHeadingNode = (node) =>
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    node.type === "heading" &&
    "depth" in node;

/**
 * @param {VFile} file
 * @param {Heading} sectionHeading
 * @param {Heading | undefined} nextSectionHeading
 *
 * @returns {string}
 */
const getSectionContent = (file, sectionHeading, nextSectionHeading) => {
    const sectionStartOffset = sectionHeading.position?.end?.offset;
    const nextSectionOffset = nextSectionHeading?.position?.start?.offset;
    const markdownStartOffset =
        typeof sectionStartOffset === "number" ? sectionStartOffset : 0;
    const markdownEndOffset =
        typeof nextSectionOffset === "number"
            ? nextSectionOffset
            : String(file).length;

    return String(file).slice(markdownStartOffset, markdownEndOffset);
};

/**
 * @param {Root} tree
 * @param {1 | 2} depth
 *
 * @returns {readonly Heading[]}
 */
const getHeadingsByDepth = (tree, depth) =>
    tree.children.filter(
        /**
         * @param {unknown} node
         *
         * @returns {node is Heading}
         */
        (node) =>
            typeof node === "object" &&
            node !== null &&
            "type" in node &&
            node.type === "heading" &&
            "depth" in node &&
            node.depth === depth
    );

/**
 * @param {readonly Heading[]} h2Headings
 * @param {number} index
 *
 * @returns {Heading | undefined}
 */
const getH2HeadingNodeAt = (h2Headings, index) =>
    index >= 0 && index < h2Headings.length ? h2Headings[index] : undefined;

/**
 * @param {VFile} file
 * @param {readonly Heading[]} h1Headings
 * @param {string | undefined} expectedRuleTitle
 * @param {readonly string[]} ruleNamespaceAliases
 */
const reportH1HeadingIssues = (
    file,
    h1Headings,
    expectedRuleTitle,
    ruleNamespaceAliases
) => {
    if (h1Headings.length !== 1) {
        file.message(
            "Helper docs must contain exactly one H1 heading.",
            h1Headings[0],
            "remark-lint:rule-doc-headings:h1-count"
        );
    }

    if (h1Headings.length !== 1 || typeof expectedRuleTitle !== "string") {
        return;
    }

    const actualTitle = getNodeText(h1Headings[0]).trim();
    const expectedH1Titles = getExpectedH1Titles(
        expectedRuleTitle,
        ruleNamespaceAliases
    );

    if (!expectedH1Titles.includes(actualTitle)) {
        file.message(
            `H1 heading must match one of: ${formatInlineCodeList(expectedH1Titles)}.`,
            h1Headings[0],
            "remark-lint:rule-doc-headings:h1-title"
        );
    }
};

/**
 * @param {VFile} file
 * @param {readonly Heading[]} h2Headings
 * @param {readonly string[]} headingNames
 * @param {(headingKey: keyof typeof defaultHeadingToggles) => boolean} isHeadingEnabled
 */
const reportDuplicateH2HeadingIssues = (
    file,
    h2Headings,
    headingNames,
    isHeadingEnabled
) => {
    const seenHeadings = new Set();

    for (const [index, headingName] of headingNames.entries()) {
        const headingDefinition =
            canonicalHeadingDefinitionsByTitle.get(headingName);

        if (
            headingDefinition !== undefined &&
            !isHeadingEnabled(headingDefinition.key)
        ) {
            continue;
        }

        if (seenHeadings.has(headingName)) {
            file.message(
                `Duplicate H2 heading \`${headingName}\` is not allowed.`,
                h2Headings[index],
                "remark-lint:rule-doc-headings:duplicate-heading"
            );
            continue;
        }

        seenHeadings.add(headingName);
    }
};

/**
 * @param {Root} tree
 * @param {VFile} file
 * @param {(headingKey: keyof typeof defaultHeadingToggles) => boolean} isHeadingEnabled
 * @param {ReadonlySet<string>} optionalDetailHeadings
 */
const reportDetailHeadingIssues = (
    tree,
    file,
    isHeadingEnabled,
    optionalDetailHeadings
) => {
    let currentH2HeadingName;
    let detectionBoundariesHeadingIndex = -1;
    let matchedPatternsHeadingIndex = -1;

    for (const [index, node] of tree.children.entries()) {
        if (!isHeadingNode(node)) {
            continue;
        }

        const headingName = getNodeText(node).trim();
        const detailHeadingDefinition =
            optionalDetailHeadingDefinitionsByTitle.get(headingName);

        if (node.depth === 2) {
            currentH2HeadingName = headingName;
            continue;
        }

        if (
            node.depth !== 3 ||
            detailHeadingDefinition === undefined ||
            !isHeadingEnabled(detailHeadingDefinition.key) ||
            !optionalDetailHeadings.has(headingName)
        ) {
            continue;
        }

        if (
            currentH2HeadingName === undefined ||
            !optionalDetailAllowedParentHeadings.has(currentH2HeadingName)
        ) {
            file.message(
                `\`### ${headingName}\` must be placed under \`## Targeted pattern scope\` or \`## What this rule reports\`.`,
                node,
                "remark-lint:rule-doc-headings:detail-heading-parent"
            );
        }

        if (headingName === "Matched patterns") {
            matchedPatternsHeadingIndex = index;
        }

        if (headingName === "Detection boundaries") {
            detectionBoundariesHeadingIndex = index;
        }
    }

    if (
        detectionBoundariesHeadingIndex !== -1 &&
        matchedPatternsHeadingIndex !== -1 &&
        detectionBoundariesHeadingIndex < matchedPatternsHeadingIndex
    ) {
        const detectionBoundariesHeading =
            tree.children[detectionBoundariesHeadingIndex];

        file.message(
            "`### Detection boundaries` must appear after `### Matched patterns` when both are present.",
            detectionBoundariesHeading,
            "remark-lint:rule-doc-headings:detail-heading-order"
        );
    }
};

/**
 * @param {VFile} file
 * @param {readonly Heading[]} h2Headings
 * @param {readonly string[]} headingNames
 * @param {Map<string, number>} headingOrderIndex
 * @param {(headingKey: keyof typeof defaultHeadingToggles) => boolean} isHeadingEnabled
 */
const reportHeadingOrderIssues = (
    file,
    h2Headings,
    headingNames,
    headingOrderIndex,
    isHeadingEnabled
) => {
    let lastOrder = -1;

    for (const [index, headingName] of headingNames.entries()) {
        const headingDefinition =
            canonicalHeadingDefinitionsByTitle.get(headingName);

        if (
            headingDefinition !== undefined &&
            !isHeadingEnabled(headingDefinition.key)
        ) {
            continue;
        }

        const headingOrder = headingOrderIndex.get(headingName);
        const headingNode = h2Headings[index];

        if (headingOrder === undefined) {
            file.message(
                `Unexpected H2 heading \`${headingName}\`. Allowed helper-doc headings: ${canonicalHeadingOrder.join(", ")}.`,
                headingNode,
                "remark-lint:rule-doc-headings:unknown-heading"
            );
            continue;
        }

        if (headingOrder < lastOrder) {
            file.message(
                `Heading \`${headingName}\` is out of order. Follow the canonical helper-doc sequence.`,
                headingNode,
                "remark-lint:rule-doc-headings:order"
            );
        }

        lastOrder = headingOrder;
    }
};

/**
 * @param {VFile} file
 * @param {readonly string[]} headingNames
 * @param {readonly (typeof canonicalHeadingDefinitions)[number][]} requiredCanonicalHeadings
 */
const reportMissingRequiredHeadingIssues = (
    file,
    headingNames,
    requiredCanonicalHeadings
) => {
    for (const requiredHeading of requiredCanonicalHeadings) {
        if (!headingNames.includes(requiredHeading.heading)) {
            file.message(
                `Missing required H2 heading \`${requiredHeading.heading}\`.`,
                undefined,
                "remark-lint:rule-doc-headings:missing-required"
            );
        }
    }
};

/**
 * @param {string} text
 *
 * @returns {boolean}
 */
const containsInlineMarkdownLink = (text) => {
    let openBracketSeen = false;

    for (let index = 0; index < text.length; index += 1) {
        const character = text.charAt(index);

        if (character === "[") {
            openBracketSeen = true;
            continue;
        }

        if (
            openBracketSeen &&
            character === "]" &&
            text.charAt(index + 1) === "(" &&
            text.includes(")", index + 2)
        ) {
            return true;
        }
    }

    return false;
};

/**
 * @param {object} parameters
 * @param {VFile} parameters.file
 * @param {readonly Heading[]} parameters.h2Headings
 * @param {readonly string[]} parameters.headingNames
 * @param {Heading | undefined} parameters.firstH2HeadingNode
 * @param {boolean} parameters.targetedPatternScopeEnabled
 * @param {boolean} parameters.whatThisRuleReportsEnabled
 */
const reportTargetedScopeIssues = ({
    file,
    h2Headings,
    headingNames,
    firstH2HeadingNode,
    targetedPatternScopeEnabled,
    whatThisRuleReportsEnabled,
}) => {
    const targetedPatternScopeIndex = headingNames.indexOf(
        "Targeted pattern scope"
    );
    const whatThisRuleReportsIndex = headingNames.indexOf(
        "What this rule reports"
    );

    if (targetedPatternScopeEnabled && targetedPatternScopeIndex !== 0) {
        const targetedPatternScopeHeading =
            getH2HeadingNodeAt(h2Headings, targetedPatternScopeIndex) ??
            getH2HeadingNodeAt(h2Headings, whatThisRuleReportsIndex) ??
            firstH2HeadingNode;

        file.message(
            "`## Targeted pattern scope` must be the first H2 section.",
            targetedPatternScopeHeading,
            "remark-lint:rule-doc-headings:targeted-scope-position"
        );
    }

    if (
        targetedPatternScopeEnabled &&
        whatThisRuleReportsEnabled &&
        whatThisRuleReportsIndex !== targetedPatternScopeIndex + 1
    ) {
        const targetedPatternScopeHeading =
            getH2HeadingNodeAt(h2Headings, whatThisRuleReportsIndex) ??
            getH2HeadingNodeAt(h2Headings, targetedPatternScopeIndex) ??
            firstH2HeadingNode;

        file.message(
            "`## What this rule reports` must immediately follow `## Targeted pattern scope`.",
            targetedPatternScopeHeading,
            "remark-lint:rule-doc-headings:targeted-scope-adjacent"
        );
    }
};

/**
 * @param {object} parameters
 * @param {VFile} parameters.file
 * @param {readonly Heading[]} parameters.h2Headings
 * @param {readonly string[]} parameters.headingNames
 * @param {boolean} parameters.packageDocumentationEnabled
 * @param {boolean} parameters.requirePackageDocumentation
 * @param {boolean} parameters.requirePackageDocumentationLabel
 * @param {RegExp} parameters.packageDocumentationLabelPattern
 * @param {boolean} parameters.furtherReadingEnabled
 */
const reportPackageDocumentationIssues = ({
    file,
    h2Headings,
    headingNames,
    packageDocumentationEnabled,
    requirePackageDocumentation,
    requirePackageDocumentationLabel,
    packageDocumentationLabelPattern,
    furtherReadingEnabled,
}) => {
    const packageDocumentationIndex = headingNames.indexOf(
        "Package documentation"
    );
    const furtherReadingIndex = headingNames.indexOf("Further reading");

    if (
        packageDocumentationEnabled &&
        requirePackageDocumentation &&
        packageDocumentationIndex === -1
    ) {
        file.message(
            "Missing required `## Package documentation` section.",
            undefined,
            "remark-lint:rule-doc-headings:missing-package-docs"
        );
    }

    if (furtherReadingEnabled && furtherReadingIndex === -1) {
        file.message(
            "Missing required `## Further reading` section.",
            undefined,
            "remark-lint:rule-doc-headings:missing-further-reading"
        );
    }

    if (
        packageDocumentationEnabled &&
        furtherReadingEnabled &&
        packageDocumentationIndex !== -1 &&
        furtherReadingIndex !== -1 &&
        packageDocumentationIndex !== furtherReadingIndex - 1
    ) {
        const packageHeadingNode = h2Headings[packageDocumentationIndex];

        file.message(
            "`## Package documentation` must appear immediately before `## Further reading`.",
            packageHeadingNode,
            "remark-lint:rule-doc-headings:package-placement"
        );
    }

    if (
        !packageDocumentationEnabled ||
        !requirePackageDocumentationLabel ||
        packageDocumentationIndex === -1
    ) {
        return;
    }

    const packageDocumentationHeading = h2Headings[packageDocumentationIndex];

    if (packageDocumentationHeading === undefined) {
        return;
    }

    const nextPackageSectionHeading = h2Headings[packageDocumentationIndex + 1];
    const packageDocumentationContent = getSectionContent(
        file,
        packageDocumentationHeading,
        nextPackageSectionHeading
    );

    if (!packageDocumentationLabelPattern.test(packageDocumentationContent)) {
        file.message(
            "`## Package documentation` must include at least one `<package> package documentation:` label line.",
            packageDocumentationHeading,
            "remark-lint:rule-doc-headings:package-docs-label"
        );
    }
};

/**
 * @param {object} parameters
 * @param {VFile} parameters.file
 * @param {readonly Heading[]} parameters.h2Headings
 * @param {readonly string[]} parameters.headingNames
 * @param {boolean} parameters.deprecatedEnabled
 */
const reportDeprecatedSectionIssues = ({
    file,
    h2Headings,
    headingNames,
    deprecatedEnabled,
}) => {
    const deprecatedSectionIndex = headingNames.indexOf("Deprecated");

    if (!deprecatedEnabled || deprecatedSectionIndex === -1) {
        return;
    }

    const deprecatedSectionHeading = h2Headings[deprecatedSectionIndex];

    if (deprecatedSectionHeading === undefined) {
        return;
    }

    const nextH2Heading = h2Headings[deprecatedSectionIndex + 1];
    const deprecatedSectionContent = getSectionContent(
        file,
        deprecatedSectionHeading,
        nextH2Heading
    );

    if (!containsInlineMarkdownLink(deprecatedSectionContent)) {
        file.message(
            "`## Deprecated` should include a link to the recommended replacement rule or package.",
            deprecatedSectionHeading,
            "remark-lint:rule-doc-headings:deprecated-replacement-link"
        );
    }
};

/**
 * @param {object} parameters
 * @param {VFile} parameters.file
 * @param {RegExp} parameters.ruleCatalogIdLinePattern
 * @param {number} parameters.furtherReadingIndex
 * @param {Heading | undefined} parameters.firstH2HeadingNode
 * @param {readonly Heading[]} parameters.h2Headings
 */
const reportRuleCatalogMarkerIssues = ({
    file,
    ruleCatalogIdLinePattern,
    furtherReadingIndex,
    firstH2HeadingNode,
    h2Headings,
}) => {
    const markdownContent = String(file);
    const ruleCatalogIdLines = markdownContent
        .split(/\r?\n/u)
        .map((line) => line.trimEnd())
        .filter((line) => ruleCatalogIdLinePattern.test(line));
    const markerNode =
        getH2HeadingNodeAt(h2Headings, furtherReadingIndex) ??
        firstH2HeadingNode;

    if (ruleCatalogIdLines.length === 0) {
        file.message(
            "Missing required rule catalog marker line `> **Rule catalog ID:** R###`.",
            markerNode,
            "remark-lint:rule-doc-headings:missing-rule-catalog-id"
        );
    }

    if (ruleCatalogIdLines.length > 1) {
        file.message(
            "Rule docs must contain exactly one `> **Rule catalog ID:** R###` marker line.",
            markerNode,
            "remark-lint:rule-doc-headings:duplicate-rule-catalog-id"
        );
    }
};

/**
 * Enforce canonical helper-doc heading schema.
 *
 * @param {RemarkLintRuleDocHeadingsOptions} [options]
 *
 * @returns {(tree: Node, file: VFile) => void}
 */
export default function remarkLintRuleDocHeadings(options = {}) {
    const headingToggles =
        options.headings === undefined
            ? defaultHeadingToggles
            : {
                  ...defaultHeadingToggles,
                  ...options.headings,
              };
    const helperDocPathPattern = options.helperDocPathPattern;
    const requirePackageDocumentation =
        options.requirePackageDocumentation ?? false;
    const requirePackageDocumentationLabel =
        options.requirePackageDocumentationLabel ??
        options.packageDocumentationLabelPattern !== undefined;
    const packageDocumentationLabelPattern =
        options.packageDocumentationLabelPattern ??
        defaultPackageDocumentationLabelPattern;
    const ruleCatalogIdLinePattern =
        options.ruleCatalogIdLinePattern ?? defaultRuleCatalogIdLinePattern;
    /** @param {keyof typeof defaultHeadingToggles} headingKey */
    const isHeadingEnabled = (headingKey) =>
        headingToggles[headingKey] !== false;
    const enabledCanonicalHeadingOrder = canonicalHeadingDefinitions
        .filter((definition) => isHeadingEnabled(definition.key))
        .map((definition) => definition.heading);
    const headingOrderIndex = new Map(
        enabledCanonicalHeadingOrder.map((heading, index) => [heading, index])
    );
    const optionalDetailHeadings = new Set(
        optionalDetailHeadingDefinitions
            .filter((definition) => isHeadingEnabled(definition.key))
            .map((definition) => definition.heading)
    );
    const requiredCanonicalHeadings = canonicalHeadingDefinitions.filter(
        (definition) =>
            isHeadingEnabled(definition.key) && definition.requiredByDefault
    );

    return (tree, file) => {
        if (typeof file.path !== "string") {
            return;
        }

        if (!isRootNode(tree)) {
            return;
        }

        const normalizedPath = normalizePath(file.path);

        if (!isHelperDocPath(normalizedPath, helperDocPathPattern)) {
            return;
        }

        const h1Headings = getHeadingsByDepth(tree, 1);
        const h2Headings = getHeadingsByDepth(tree, 2);
        const headingNames = h2Headings.map((heading) =>
            getNodeText(heading).trim()
        );

        const expectedRuleTitle = normalizedPath
            .split("/")
            .at(-1)
            ?.replace(/\.md$/u, "");
        const packageMetadata = getNearestPackageMetadata(file.path);
        const packageRuleNamespaceAliases = isPackageName(packageMetadata?.name)
            ? getRuleNamespaceAliasesFromPackageName(packageMetadata.name)
            : [];
        const ruleNamespaceAliases = [
            ...new Set([
                ...packageRuleNamespaceAliases,
                ...(options.ruleNamespaceAliases ?? []),
            ]),
        ];

        reportH1HeadingIssues(
            file,
            h1Headings,
            expectedRuleTitle,
            ruleNamespaceAliases
        );
        reportDuplicateH2HeadingIssues(
            file,
            h2Headings,
            headingNames,
            isHeadingEnabled
        );
        reportDetailHeadingIssues(
            tree,
            file,
            isHeadingEnabled,
            optionalDetailHeadings
        );
        reportHeadingOrderIssues(
            file,
            h2Headings,
            headingNames,
            headingOrderIndex,
            isHeadingEnabled
        );
        reportMissingRequiredHeadingIssues(
            file,
            headingNames,
            requiredCanonicalHeadings
        );

        const furtherReadingIndex = headingNames.indexOf("Further reading");
        const packageDocumentationEnabled = isHeadingEnabled(
            "packageDocumentation"
        );
        const furtherReadingEnabled = isHeadingEnabled("furtherReading");
        const deprecatedEnabled = isHeadingEnabled("deprecated");
        const targetedPatternScopeEnabled = isHeadingEnabled(
            "targetedPatternScope"
        );
        const whatThisRuleReportsEnabled = isHeadingEnabled(
            "whatThisRuleReports"
        );
        const firstH2HeadingNode = h2Headings[0];

        reportTargetedScopeIssues({
            file,
            firstH2HeadingNode,
            h2Headings,
            headingNames,
            targetedPatternScopeEnabled,
            whatThisRuleReportsEnabled,
        });
        reportPackageDocumentationIssues({
            file,
            h2Headings,
            headingNames,
            furtherReadingEnabled,
            packageDocumentationEnabled,
            packageDocumentationLabelPattern,
            requirePackageDocumentation,
            requirePackageDocumentationLabel,
        });
        reportDeprecatedSectionIssues({
            deprecatedEnabled,
            file,
            h2Headings,
            headingNames,
        });
        reportRuleCatalogMarkerIssues({
            file,
            firstH2HeadingNode,
            furtherReadingIndex,
            h2Headings,
            ruleCatalogIdLinePattern,
        });
    };
}
