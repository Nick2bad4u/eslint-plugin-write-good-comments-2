import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import process from "node:process";

import { evaluateNpmAuditPolicy } from "./npm-audit-policy.mjs";

/** Environment key propagated by a parent npm process from legacy user config. */
const inheritedAllowScriptsKey = "npm_config_allow_scripts";

/** Preserve all environment values except the incompatible inherited setting. */
const auditEnvironment = Object.fromEntries(
    Object.entries(process.env).filter(
        ([key]) => key.toLowerCase() !== inheritedAllowScriptsKey
    )
);
const npmCliPath = process.env["npm_execpath"];

/**
 * Check whether a parsed value is an object record.
 *
 * @param {unknown} value - Value to inspect.
 *
 * @returns {value is Record<string, unknown>} Whether the value is a record.
 */
const isRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Read one repository JSON file as untrusted structured data.
 *
 * @param {string} path - Repository-relative JSON path.
 *
 * @returns {Readonly<Record<string, unknown>>} Parsed JSON object.
 */
const readJsonFile = (path) => {
    /** @type {unknown} */
    const value = JSON.parse(readFileSync(path, "utf8"));

    if (!isRecord(value)) {
        throw new TypeError(`${path} must contain a JSON object.`);
    }

    return value;
};

if (npmCliPath === undefined || npmCliPath.length === 0) {
    throw new Error(
        "npm_execpath is unavailable; run this check via npm run audit."
    );
}

const auditResult = spawnSync(
    process.execPath,
    [
        npmCliPath,
        "audit",
        "--audit-level=low",
        "--json",
    ],
    {
        cwd: process.cwd(),
        env: auditEnvironment,
        encoding: "utf8",
    }
);

if (auditResult.error !== undefined) {
    throw new Error("Unable to start npm audit.", {
        cause: auditResult.error,
    });
}

/** @type {unknown} */
const auditReport = JSON.parse(auditResult.stdout);

if (!isRecord(auditReport)) {
    throw new TypeError("npm audit did not return a JSON object.");
}

const policyResult = evaluateNpmAuditPolicy({
    auditReport,
    docsPackage: readJsonFile("docs/docusaurus/package.json"),
    lockfile: readJsonFile("package-lock.json"),
    rootPackage: readJsonFile("package.json"),
});

if (policyResult.status === "clean" && auditResult.status === 0) {
    console.log("npm audit found no vulnerabilities.");
} else if (policyResult.status === "accepted" && auditResult.status === 1) {
    console.warn(
        `Accepted npm advisories ${policyResult.advisorySources.join(", ")} for image-size@2.0.2 in the private docs workspace only. ` +
            "The sole parent is @docusaurus/mdx-loader, which is unreachable from the root runtime or bundled graph, and published package files exclude the workspace. " +
            "Remove this exception when a patched image-size release is available."
    );
} else {
    process.stdout.write(auditResult.stdout);
    process.stderr.write(auditResult.stderr);
    console.error(
        policyResult.status === "rejected"
            ? policyResult.reason
            : `Unexpected npm audit exit status ${auditResult.status ?? "null"}.`
    );
    process.exitCode =
        auditResult.status === null || auditResult.status === 0
            ? 1
            : auditResult.status;
}
