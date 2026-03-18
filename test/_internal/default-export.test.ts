/**
 * @packageDocumentation
 * Regression coverage for default-export normalization helpers.
 */

import { describe, expect, it } from "vitest";

import { resolveDefaultExport } from "../../src/_internal/default-export";

describe("default-export helper", () => {
    it("returns primitives unchanged", () => {
        expect(resolveDefaultExport("value")).toBe("value");
        expect(resolveDefaultExport(42)).toBe(42);
        expect(resolveDefaultExport(null)).toBeNull();
    });

    it("returns plain objects without a default export unchanged", () => {
        const value = { plugin: true };

        expect(resolveDefaultExport(value)).toBe(value);
    });

    it("unwraps nested default exports until it reaches the real value", () => {
        const plugin = { name: "plugin" };
        const wrapped = {
            default: {
                default: plugin,
            },
        };

        expect(resolveDefaultExport(wrapped)).toBe(plugin);
    });
});
