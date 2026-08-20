/**
 * @packageDocumentation
 * Fail-closed policy evaluation for npm audit results.
 */

/** Advisory sources currently accepted for the private docs workspace. */
const acceptedImageSizeAdvisories = new Set([1_138_808, 1_138_809]);

/** Reviewed package path that must remain private-docs-only. */
const docusaurusMdxLoaderPath = "node_modules/@docusaurus/mdx-loader";

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
 * Collect dependency names that can participate in an installed runtime graph.
 *
 * @param {Readonly<Record<string, unknown>>} packageMetadata - Package manifest
 *   or lockfile metadata.
 * @param {boolean} includeDevDependencies - Whether to include dev roots.
 *
 * @returns {Set<string>} Declared dependency names.
 */
const getDependencyNames = (
    packageMetadata,
    includeDevDependencies = false
) => {
    const dependencyNames = new Set();
    const dependencyFields = [
        "dependencies",
        "optionalDependencies",
        "peerDependencies",
        ...(includeDevDependencies ? ["devDependencies"] : []),
    ];

    for (const dependencyField of dependencyFields) {
        const dependencies = Reflect.get(packageMetadata, dependencyField);

        if (dependencies === undefined) {
            continue;
        }

        if (!isRecord(dependencies)) {
            throw new TypeError(
                `Expected ${dependencyField} to be an object when present.`
            );
        }

        for (const dependencyName of Object.keys(dependencies)) {
            dependencyNames.add(dependencyName);
        }
    }

    for (const bundleField of ["bundleDependencies", "bundledDependencies"]) {
        const bundledDependencies = Reflect.get(packageMetadata, bundleField);

        if (bundledDependencies === undefined) {
            continue;
        }

        if (
            !Array.isArray(bundledDependencies) ||
            bundledDependencies.some(
                (dependencyName) => typeof dependencyName !== "string"
            )
        ) {
            throw new TypeError(
                `Expected ${bundleField} to be a string array when present.`
            );
        }

        for (const dependencyName of bundledDependencies) {
            dependencyNames.add(dependencyName);
        }
    }

    return dependencyNames;
};

/**
 * Resolve an installed dependency using Node's nearest-node_modules lookup.
 *
 * @param {string} importerPath - Lockfile package path doing the import.
 * @param {string} dependencyName - Package name to resolve.
 * @param {Readonly<Record<string, unknown>>} packages - Lockfile packages.
 *
 * @returns {string | undefined} Resolved lockfile package path.
 */
const resolveLockedDependencyPath = (
    importerPath,
    dependencyName,
    packages
) => {
    let searchPath = importerPath;

    while (true) {
        const candidatePath = `${searchPath.length > 0 ? `${searchPath}/` : ""}node_modules/${dependencyName}`;

        if (isRecord(packages[candidatePath])) {
            return candidatePath;
        }

        if (searchPath.length === 0) {
            return undefined;
        }

        const separatorIndex = searchPath.lastIndexOf("/");
        searchPath =
            separatorIndex === -1 ? "" : searchPath.slice(0, separatorIndex);
    }
};

/**
 * Determine whether a package is reachable from one manifest dependency graph.
 *
 * @param {Readonly<{
 *     importerPath: string;
 *     includeDevDependencies?: boolean;
 *     manifest: Readonly<Record<string, unknown>>;
 *     packages: Readonly<Record<string, unknown>>;
 *     targetPath: string;
 * }>} input
 *   - Graph roots and lockfile package metadata.
 *
 * @returns {boolean} Whether the target is reachable.
 */
const isPackageReachable = ({
    importerPath,
    includeDevDependencies = false,
    manifest,
    packages,
    targetPath,
}) => {
    const pendingPaths = [];

    for (const dependencyName of getDependencyNames(
        manifest,
        includeDevDependencies
    )) {
        const dependencyPath = resolveLockedDependencyPath(
            importerPath,
            dependencyName,
            packages
        );

        if (dependencyPath !== undefined) {
            pendingPaths.push(dependencyPath);
        }
    }

    const visitedPaths = new Set();

    while (pendingPaths.length > 0) {
        const packagePath = pendingPaths.pop();

        if (packagePath === undefined) {
            continue;
        }

        if (packagePath === targetPath) {
            return true;
        }

        const packageMetadata = packages[packagePath];

        if (!isRecord(packageMetadata)) {
            throw new TypeError(
                `Expected lockfile metadata for ${packagePath}.`
            );
        }

        const linkedPath = Reflect.get(packageMetadata, "resolved");
        const traversalPath =
            Reflect.get(packageMetadata, "link") === true &&
            typeof linkedPath === "string"
                ? linkedPath.replaceAll("\\", "/")
                : packagePath;

        if (traversalPath === targetPath) {
            return true;
        }

        if (visitedPaths.has(traversalPath)) {
            continue;
        }

        visitedPaths.add(traversalPath);

        const traversalMetadata = packages[traversalPath];

        if (!isRecord(traversalMetadata)) {
            throw new TypeError(
                `Expected lockfile metadata for ${traversalPath}.`
            );
        }

        for (const dependencyName of getDependencyNames(traversalMetadata)) {
            const dependencyPath = resolveLockedDependencyPath(
                traversalPath,
                dependencyName,
                packages
            );

            if (dependencyPath !== undefined) {
                pendingPaths.push(dependencyPath);
            }
        }
    }

    return false;
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
        isPackageReachable({
            importerPath: "",
            manifest: rootPackage,
            packages,
            targetPath: docusaurusMdxLoaderPath,
        })
    ) {
        return "@docusaurus/mdx-loader is reachable from the root runtime or bundled dependency graph.";
    }

    if (
        !isPackageReachable({
            importerPath: "docs/docusaurus",
            includeDevDependencies: true,
            manifest: docsPackage,
            packages,
            targetPath: docusaurusMdxLoaderPath,
        })
    ) {
        return "@docusaurus/mdx-loader is no longer reachable from the private documentation workspace.";
    }

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
        dependencyParents[0] !== docusaurusMdxLoaderPath
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
        vulnerabilityNames: vulnerabilityNames.toSorted((left, right) =>
            left.localeCompare(right)
        ),
    };
};
