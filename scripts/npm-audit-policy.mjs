/**
 * @packageDocumentation
 * Fail-closed policy evaluation for npm audit results.
 */

/** Advisory sources currently accepted for the private docs workspace. */
const acceptedImageSizeAdvisories = new Set([1_138_808, 1_138_809]);

/**
 * Check whether a value is a non-null object record.
 *
 * @param {unknown} value - Value to inspect.
 *
 * @returns {value is Record<string, unknown>} Whether the value is a record.
 */
const isRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Read and validate an object-valued property.
 *
 * @param {Readonly<Record<string, unknown>>} record - Source record.
 * @param {string} propertyName - Property to read.
 *
 * @returns {Readonly<Record<string, unknown>>} Validated property record.
 */
const getRecordProperty = (record, propertyName) => {
    const value = Reflect.get(record, propertyName);

    if (!isRecord(value)) {
        throw new TypeError(`Expected ${propertyName} to be an object.`);
    }

    return value;
};

/**
 * Collect leaf advisory sources for one vulnerability graph node.
 *
 * @param {string} vulnerabilityName - Vulnerability node to inspect.
 * @param {Readonly<Record<string, unknown>>} vulnerabilities - Audit graph.
 * @param {Set<string>} visiting - Nodes in the current recursion path.
 *
 * @returns {Set<number>} Leaf npm advisory source identifiers.
 */
const collectAdvisorySources = (
    vulnerabilityName,
    vulnerabilities,
    visiting = new Set()
) => {
    if (visiting.has(vulnerabilityName)) {
        throw new Error(
            `npm audit returned a cyclic vulnerability graph at ${vulnerabilityName}.`
        );
    }

    const vulnerability = vulnerabilities[vulnerabilityName];

    if (!isRecord(vulnerability)) {
        throw new TypeError(
            `npm audit referenced missing vulnerability ${vulnerabilityName}.`
        );
    }

    const via = Reflect.get(vulnerability, "via");

    if (!Array.isArray(via)) {
        throw new TypeError(
            `npm audit vulnerability ${vulnerabilityName} has no via array.`
        );
    }

    const nextVisiting = new Set(visiting).add(vulnerabilityName);
    const sources = new Set();

    for (const cause of via) {
        if (typeof cause === "string") {
            for (const source of collectAdvisorySources(
                cause,
                vulnerabilities,
                nextVisiting
            )) {
                sources.add(source);
            }

            continue;
        }

        if (!isRecord(cause)) {
            throw new TypeError(
                `npm audit vulnerability ${vulnerabilityName} has an invalid cause.`
            );
        }

        const source = Reflect.get(cause, "source");

        if (typeof source !== "number" || !Number.isSafeInteger(source)) {
            throw new TypeError(
                `npm audit vulnerability ${vulnerabilityName} has an invalid advisory source.`
            );
        }

        sources.add(source);
    }

    if (sources.size === 0) {
        throw new Error(
            `npm audit vulnerability ${vulnerabilityName} has no leaf advisory source.`
        );
    }

    return sources;
};

/**
 * Verify that image-size remains isolated to the private documentation build.
 *
 * @param {Readonly<Record<string, unknown>>} auditReport - Parsed npm audit
 *   JSON.
 * @param {Readonly<Record<string, unknown>>} rootPackage - Root package.json.
 * @param {Readonly<Record<string, unknown>>} docsPackage - Docs package.json.
 * @param {Readonly<Record<string, unknown>>} lockfile - Root package-lock.json.
 *
 * @returns {string | undefined} Rejection reason, if the boundary changed.
 */
const getImageSizeBoundaryRejection = (
    auditReport,
    rootPackage,
    docsPackage,
    lockfile
) => {
    if (Reflect.get(docsPackage, "private") !== true) {
        return "The documentation workspace is no longer private.";
    }

    const publishedFiles = Reflect.get(rootPackage, "files");

    if (
        !Array.isArray(publishedFiles) ||
        publishedFiles.some(
            (file) =>
                typeof file !== "string" ||
                file.replaceAll("\\", "/").startsWith("docs/docusaurus")
        )
    ) {
        return "The root package file allowlist can expose the documentation workspace.";
    }

    const vulnerabilities = getRecordProperty(auditReport, "vulnerabilities");
    const imageSizeVulnerability = vulnerabilities["image-size"];

    if (
        !isRecord(imageSizeVulnerability) ||
        Reflect.get(imageSizeVulnerability, "isDirect") !== false
    ) {
        return "image-size is missing or is now a direct dependency.";
    }

    const packages = getRecordProperty(lockfile, "packages");
    const imageSizePackage = packages["node_modules/image-size"];

    if (
        !isRecord(imageSizePackage) ||
        Reflect.get(imageSizePackage, "version") !== "2.0.2"
    ) {
        return "The reviewed image-size version changed from 2.0.2.";
    }

    const dependencyParents = [];

    for (const [packagePath, packageMetadata] of Object.entries(packages)) {
        if (!isRecord(packageMetadata)) {
            continue;
        }

        const dependencies = Reflect.get(packageMetadata, "dependencies");

        if (
            isRecord(dependencies) &&
            Object.hasOwn(dependencies, "image-size")
        ) {
            dependencyParents.push(packagePath);
        }
    }

    if (
        dependencyParents.length !== 1 ||
        dependencyParents[0] !== "node_modules/@docusaurus/mdx-loader"
    ) {
        return `image-size dependency parents changed: ${dependencyParents.join(", ") || "none"}.`;
    }

    return undefined;
};

/**
 * Evaluate an npm audit report against the repository's narrow exception.
 *
 * @param {Readonly<{
 *     auditReport: Readonly<Record<string, unknown>>;
 *     docsPackage: Readonly<Record<string, unknown>>;
 *     lockfile: Readonly<Record<string, unknown>>;
 *     rootPackage: Readonly<Record<string, unknown>>;
 * }>} input
 *   - Audit report and repository manifests.
 *
 * @returns {Readonly<
 *     | {
 *           status: "accepted";
 *           advisorySources: readonly number[];
 *           vulnerabilityNames: readonly string[];
 *       }
 *     | { status: "clean" }
 *     | { status: "rejected"; reason: string }
 * >}
 *   Policy result.
 */
export const evaluateNpmAuditPolicy = ({
    auditReport,
    docsPackage,
    lockfile,
    rootPackage,
}) => {
    const vulnerabilities = getRecordProperty(auditReport, "vulnerabilities");
    const vulnerabilityNames = Object.keys(vulnerabilities);

    if (vulnerabilityNames.length === 0) {
        return { status: "clean" };
    }

    const advisorySources = new Set();

    for (const vulnerabilityName of vulnerabilityNames) {
        for (const source of collectAdvisorySources(
            vulnerabilityName,
            vulnerabilities
        )) {
            advisorySources.add(source);
        }
    }

    const unexpectedSources = [...advisorySources].filter(
        (source) => !acceptedImageSizeAdvisories.has(source)
    );

    if (unexpectedSources.length > 0) {
        return {
            reason: `Unexpected npm advisory sources: ${unexpectedSources.join(", ")}.`,
            status: "rejected",
        };
    }

    const boundaryRejection = getImageSizeBoundaryRejection(
        auditReport,
        rootPackage,
        docsPackage,
        lockfile
    );

    if (boundaryRejection !== undefined) {
        return {
            reason: boundaryRejection,
            status: "rejected",
        };
    }

    return {
        advisorySources: [...advisorySources].sort(
            (left, right) => left - right
        ),
        status: "accepted",
        vulnerabilityNames: vulnerabilityNames.toSorted(),
    };
};
