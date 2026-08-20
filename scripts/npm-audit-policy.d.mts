/** Input documents evaluated by the repository's npm audit policy. */
export type NpmAuditPolicyInput = Readonly<{
    auditReport: Readonly<Record<string, unknown>>;
    docsPackage: Readonly<Record<string, unknown>>;
    lockfile: Readonly<Record<string, unknown>>;
    rootPackage: Readonly<Record<string, unknown>>;
}>;

/** Result returned after evaluating npm audit data and package boundaries. */
export type NpmAuditPolicyResult = Readonly<
    | {
        advisorySources: readonly number[];
        status: "accepted";
        vulnerabilityNames: readonly string[];
    }
    | { status: "clean" }
    | { reason: string; status: "rejected" }
>;

/** Evaluate npm audit data against the private-docs exception. */
export declare const evaluateNpmAuditPolicy: (
    input: NpmAuditPolicyInput
) => NpmAuditPolicyResult;
