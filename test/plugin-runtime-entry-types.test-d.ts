/**
 * @packageDocumentation
 * Type-level contract tests for runtime entrypoint declarations.
 */

import { assertType } from "vitest";

import plugin from "../plugin.mjs";

assertType(plugin);
assertType(plugin.configs);
assertType(plugin.meta?.name);
assertType(plugin.meta?.version);
assertType(plugin.rules);
