/**
 * @packageDocumentation
 * Minimal ambient module used to keep the shared Vitest test-support scope non-empty.
 */

declare const __vitestGlobalsMarker: unique symbol;

export type VitestGlobalsMarker = typeof __vitestGlobalsMarker;
