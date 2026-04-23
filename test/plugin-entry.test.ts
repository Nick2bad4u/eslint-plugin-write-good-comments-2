/**
 * @packageDocumentation
 * Runtime contract coverage for the published plugin entrypoints.
 */

import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import plugin, {
    writeGoodCommentsConfigNames,
    writeGoodCommentsRules,
} from "../src/plugin";

const requireFromHere = createRequire(import.meta.url);
const packageJson = requireFromHere("../package.json") as {
    name: string;
    version: string;
};

describe("plugin entry module", () => {
    it("exports default plugin object with rule and config registries", () => {
        expect.hasAssertions();
        expect(plugin.meta).toStrictEqual({
            name: packageJson.name,
            namespace: "write-good-comments",
            version: packageJson.version,
        });

        expect(Object.keys(plugin.rules)).toStrictEqual(
            Object.keys(writeGoodCommentsRules)
        );

        const actualConfigNames = Object.keys(plugin.configs);
        const expectedConfigNames = [...writeGoodCommentsConfigNames];

        actualConfigNames.sort((left, right) => left.localeCompare(right));
        expectedConfigNames.sort((left, right) => left.localeCompare(right));

        expect(actualConfigNames).toStrictEqual(expectedConfigNames);
    });

    it("exports matching runtime plugin shape from plugin.mjs", async () => {
        expect.hasAssertions();

        const runtimePluginModule = (await import("../plugin.mjs")) as {
            default: typeof plugin;
        };

        expect(runtimePluginModule.default.meta).toStrictEqual(plugin.meta);
        expect(Object.keys(runtimePluginModule.default.rules)).toStrictEqual(
            Object.keys(plugin.rules)
        );
    });

    it("exports matching runtime plugin shape from dist/plugin.cjs", () => {
        expect.hasAssertions();

        const runtimePlugin: typeof plugin =
            requireFromHere("../dist/plugin.cjs");

        expect(runtimePlugin.meta).toStrictEqual(plugin.meta);
        expect(Object.keys(runtimePlugin.rules)).toStrictEqual(
            Object.keys(plugin.rules)
        );
    });

    it("resolves package default export through self-reference ESM import", async () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-unsanitized/method -- this test intentionally exercises Node's runtime self-reference package import.
        const packageRuntimeModule = (await import(packageJson.name)) as {
            default: typeof plugin;
        };

        expect(packageRuntimeModule.default.meta).toStrictEqual(plugin.meta);
    });

    it("resolves package default export through self-reference CJS require", () => {
        expect.hasAssertions();

        const packageRuntimePlugin: typeof plugin = requireFromHere(
            packageJson.name
        );

        expect(packageRuntimePlugin.meta).toStrictEqual(plugin.meta);
    });
});
