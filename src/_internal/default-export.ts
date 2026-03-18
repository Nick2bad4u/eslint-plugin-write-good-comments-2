/**
 * @packageDocumentation
 * Helpers for normalizing nested default exports across ESM and CJS interop.
 */

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
    if (
        typeof value === "object" &&
        value !== null &&
        Object.hasOwn(value, "default")
    ) {
        const defaultValue = Reflect.get(value, "default") as T;

        return resolveDefaultExport(defaultValue);
    }

    return value;
};
