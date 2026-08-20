#!/usr/bin/env node

/**
 * Keep `peerDependencies.eslint` compatible with the currently installed
 * `devDependencies.eslint` range without narrowing established peer floors.
 *
 * Why: npm does not support `$eslint` indirection in `peerDependencies` (that
 * syntax is supported for `overrides` only), so we synchronize supported ranges
 * explicitly after dependency updates.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { subset, validRange } from "semver";

/**
 * The file path to the package.json file, resolved from the current module's
 * URL. This is used to read and update the package.json file for synchronizing
 * the peer dependency range for eslint.
 *
 * @type {string}
 *
 * @see fileURLToPath
 * @see URL
 */
const modulePath = fileURLToPath(import.meta.url);
const packageJsonPath = fileURLToPath(
    new URL("../package.json", import.meta.url)
);
/**
 * The minimum supported range for eslint in peer dependencies. This is used as
 * a fallback when the existing peer range is absent. This ensures that the peer
 * dependency range does not fall below a certain baseline, which is important
 * for maintaining compatibility with supported versions of eslint.
 *
 * @type {string}
 *
 * @see createPeerEslintRange
 */
const minimumSupportedEslintRange = "^9.0.0";

/**
 * Read and parse package.json.
 *
 * @type {() => Promise<Record<string, unknown>>}
 *
 * @returns {Promise<Record<string, unknown>>}
 *
 * @throws {TypeError} If reading or parsing package.json fails, an error is
 *   thrown with a descriptive message.
 *
 * @see readFile
 * @see fileURLToPath
 */
const readPackageJson = async () => {
    try {
        /** @type {string} */
        const packageJsonContent = await readFile(packageJsonPath, "utf8");
        /** @type {Record<string, unknown>} */
        return JSON.parse(packageJsonContent);
        /** @type {Error} */
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new TypeError(
            `Failed to read package.json at ${packageJsonPath}: ${message}`,
            { cause: error }
        );
    }
};

/**
 * Preserve existing peer floors and add the dev range only when the current
 * peer contract does not contain it.
 *
 * @type {(
 *     existingPeerRange: unknown,
 *     devDependencyRange: string
 * ) => string}
 *
 * @param {unknown} existingPeerRange
 * @param {string} devDependencyRange
 *
 * @returns {string}
 */
export const createPeerEslintRange = (
    existingPeerRange,
    devDependencyRange
) => {
    const normalizedDevRange = devDependencyRange.trim();

    if (validRange(normalizedDevRange) === null) {
        throw new TypeError(`Invalid ESLint dev range: ${devDependencyRange}`);
    }

    const normalizedPeerRange =
        typeof existingPeerRange === "string" &&
        existingPeerRange.trim().length > 0
            ? existingPeerRange.trim()
            : minimumSupportedEslintRange;

    if (validRange(normalizedPeerRange) === null) {
        throw new TypeError(
            `Invalid existing ESLint peer range: ${normalizedPeerRange}`
        );
    }

    return subset(normalizedDevRange, normalizedPeerRange, {
        includePrerelease: true,
    })
        ? normalizedPeerRange
        : `${normalizedPeerRange} || ${normalizedDevRange}`;
};

/**
 * Check whether an unknown runtime value is a non-null object record.
 *
 * @type {(value: unknown) => value is Record<string, unknown>}
 *
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 *
 * @throws {TypeError} If the value is not a non-null object, an error is thrown
 *   with a descriptive message.
 */
const isRecord = (value) => typeof value === "object" && value !== null;

const main = async () => {
    /** @type {Record<string, unknown>} */
    const packageJson = await readPackageJson();

    /** @type {unknown} */
    const devDependencies = packageJson["devDependencies"];
    /** @type {unknown} */
    const peerDependencies = packageJson["peerDependencies"];

    if (!isRecord(devDependencies) || !isRecord(peerDependencies)) {
        /** @type {string} */
        throw new TypeError(
            "Expected package.json to include object-valued devDependencies and peerDependencies"
        );
    }

    /** @type {unknown} */
    const devDependencyEslintRange = devDependencies["eslint"];

    if (
        typeof devDependencyEslintRange !== "string" ||
        devDependencyEslintRange.trim().length === 0
    ) {
        throw new TypeError(
            "Expected devDependencies.eslint to be a non-empty string range"
        );
    }

    /** @type {string} */
    const nextPeerEslintRange = createPeerEslintRange(
        peerDependencies["eslint"],
        devDependencyEslintRange
    );

    /** @type {string} */
    if (peerDependencies["eslint"] === nextPeerEslintRange) {
        /** @type {string} */
        console.log(
            `peerDependencies.eslint already aligned: ${nextPeerEslintRange}`
        );
        /** @type {void} */
        return;
    }

    peerDependencies["eslint"] = nextPeerEslintRange;
    try {
        /** @type {string} */
        await writeFile(
            /** @type {string} */
            packageJsonPath,
            `${JSON.stringify(packageJson, null, 4)}\n`,
            "utf8"
        );
        /** @type {string} */
        console.log(
            `Updated peerDependencies.eslint to: ${nextPeerEslintRange}`
        );
    } catch (error) {
        /** @type {Error} */
        throw new TypeError(
            `Failed to write updated package.json with new peerDependencies.eslint: ${error}`,
            { cause: error }
        );
    }
};

/** Command-line module path when this file was executed directly. */
const executedModulePath = process.argv[1];

if (
    executedModulePath !== undefined &&
    resolve(executedModulePath) === modulePath
) {
    try {
        await main();
    } catch (error) {
        console.error("Failed to synchronize peerDependencies.eslint:", error);
        process.exitCode = 1;
    }
}
