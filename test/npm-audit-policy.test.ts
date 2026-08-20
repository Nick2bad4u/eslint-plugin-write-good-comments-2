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
        private: true,
    },
    lockfile: {
        packages: {
            "node_modules/@docusaurus/mdx-loader": {
                dependencies: {
                    "image-size": "^2.0.2",
                },
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
