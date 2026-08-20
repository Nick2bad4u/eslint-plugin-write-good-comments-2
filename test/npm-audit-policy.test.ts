/**
 * @packageDocumentation
 * Failure-path coverage for the repository's npm audit exception.
 */

import { describe, expect, it } from "vitest";

import { evaluateNpmAuditPolicy } from "../scripts/npm-audit-policy.mjs";

const createPolicyInput = (advisorySource = 1_138_808) => ({
    auditReport: {
        vulnerabilities: {
            "@docusaurus/mdx-loader": {
                via: ["image-size"],
            },
            "image-size": {
                isDirect: false,
                via: [{ source: advisorySource }],
            },
        },
    },
    docsPackage: {
        dependencies: {
            "docs-wrapper": "1.0.0",
        },
        private: true,
    },
    lockfile: {
        packages: {
            "node_modules/@docusaurus/mdx-loader": {
                dependencies: {
                    "image-size": "^2.0.2",
                },
                version: "3.10.2",
            },
            "node_modules/docs-wrapper": {
                dependencies: {
                    "@docusaurus/mdx-loader": "3.10.2",
                },
                version: "1.0.0",
            },
            "node_modules/image-size": {
                version: "2.0.2",
            },
        },
    },
    rootPackage: {
        files: [
            "dist",
            "docs/rules/**",
            "CHANGELOG.md",
        ],
    },
});

describe("npm audit policy", () => {
    it("accepts the reviewed private-docs advisory path", () => {
        expect.hasAssertions();

        expect(evaluateNpmAuditPolicy(createPolicyInput())).toStrictEqual({
            advisorySources: [1_138_808],
            status: "accepted",
            vulnerabilityNames: ["@docusaurus/mdx-loader", "image-size"],
        });
    });

    it("rejects an unreviewed advisory source", () => {
        expect.hasAssertions();

        expect(
            evaluateNpmAuditPolicy(createPolicyInput(999_999))
        ).toStrictEqual({
            reason: "Unexpected npm advisory sources: 999999.",
            status: "rejected",
        });
    });

    it("rejects image-size when the docs workspace becomes publishable", () => {
        expect.hasAssertions();

        expect(
            evaluateNpmAuditPolicy({
                ...createPolicyInput(),
                docsPackage: {
                    private: false,
                },
            })
        ).toStrictEqual({
            reason: "The documentation workspace is no longer private.",
            status: "rejected",
        });
    });

    it("rejects a transitive root-runtime path to the vulnerable loader", () => {
        expect.hasAssertions();

        const policyInput = createPolicyInput();

        expect(
            evaluateNpmAuditPolicy({
                ...policyInput,
                lockfile: {
                    packages: {
                        ...policyInput.lockfile.packages,
                        "node_modules/runtime-wrapper": {
                            dependencies: {
                                "@docusaurus/mdx-loader": "3.10.2",
                            },
                            version: "1.0.0",
                        },
                    },
                },
                rootPackage: {
                    ...policyInput.rootPackage,
                    dependencies: {
                        "runtime-wrapper": "1.0.0",
                    },
                },
            })
        ).toStrictEqual({
            reason: "@docusaurus/mdx-loader is reachable from the root runtime or bundled dependency graph.",
            status: "rejected",
        });
    });

    it("rejects array-shaped audit vulnerability data", () => {
        expect.hasAssertions();

        expect(() =>
            evaluateNpmAuditPolicy({
                ...createPolicyInput(),
                auditReport: {
                    vulnerabilities: [],
                },
            })
        ).toThrow("Expected vulnerabilities to be an object.");
    });
});
