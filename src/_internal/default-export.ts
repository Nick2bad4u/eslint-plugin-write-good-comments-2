/**
 * @packageDocumentation
 * Helpers for normalizing nested default exports across ESM and CJS interop.
 */

import { objectHasOwn } from "ts-extras";

/**
 * Unwrap nested `.default` layers that can appear when ESM-only unified plugins
 * are loaded through CommonJS interop.
 *
 * @param value - Imported module or value.
 *
 * @returns The innermost default export when one exists, otherwise the original
 *   value.
 */
export const resolveDefaultExport = <T>(value: T): T => {
    const candidate: unknown = value;

    if (
        typeof candidate === "object" &&
        candidate !== null &&
        objectHasOwn(candidate, "default")
    ) {
        const defaultValue = Reflect.get(candidate, "default") as T;

        return resolveDefaultExport(defaultValue);
    }

    return value;
};
