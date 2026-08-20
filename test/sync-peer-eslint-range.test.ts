/**
 * @packageDocumentation
 * Contract tests for ESLint peer-range synchronization.
 */

import { describe, expect, it } from "vitest";

import { createPeerEslintRange } from "../scripts/sync-peer-eslint-range.mjs";

describe(createPeerEslintRange, () => {
    it("preserves the established floor for an already supported major", () => {
        expect.hasAssertions();

        expect(createPeerEslintRange("^9.0.0 || ^10.5.0", "^10.8.1")).toBe(
            "^9.0.0 || ^10.5.0"
        );
    });

    it("adds the dev range when a new ESLint major is adopted", () => {
        expect.hasAssertions();

        expect(createPeerEslintRange("^9.0.0 || ^10.5.0", "^11.0.0")).toBe(
            "^9.0.0 || ^10.5.0 || ^11.0.0"
        );
    });

    it("falls back to the repository baseline when the peer range is absent", () => {
        expect.hasAssertions();

        expect(createPeerEslintRange(undefined, "^10.8.1")).toBe(
            "^9.0.0 || ^10.8.1"
        );
    });

    it("rejects a dev range whose major cannot be determined", () => {
        expect.hasAssertions();

        expect(() => createPeerEslintRange("^9.0.0", "latest")).toThrow(
            "Unable to resolve an ESLint major from dev range: latest"
        );
    });
});
