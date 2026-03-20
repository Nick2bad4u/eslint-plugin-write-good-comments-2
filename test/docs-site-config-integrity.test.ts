/**
 * @packageDocumentation
 * Contract tests for the Docusaurus site configuration.
 */

import { describe, expect, it } from "vitest";

// eslint-disable-next-line import-x/extensions, import-x/no-relative-packages -- this test intentionally loads the in-repo docs workspace config file directly.
import config from "../docs/docusaurus/docusaurus.config.ts";

type ClassicPresetOptions = Readonly<{
    blog?: boolean;
    docs?: Readonly<{
        routeBasePath?: string;
    }>;
}>;

type DocusaurusConfigLike = Readonly<{
    baseUrl: string;
    organizationName: string;
    presets?: readonly [string, ClassicPresetOptions, ...unknown[]][];
    projectName: string;
    tagline: string;
    title: string;
}>;

const getClassicPresetOptions = (
    siteConfig: DocusaurusConfigLike
): ClassicPresetOptions => {
    const classicPreset = siteConfig.presets?.[0];

    if (!Array.isArray(classicPreset)) {
        throw new TypeError("Expected the classic preset tuple.");
    }

    return classicPreset[1];
};

const siteConfig = config as unknown as DocusaurusConfigLike;

describe("docusaurus site config", () => {
    it("uses the current write-good-comments site identity", () => {
        expect(siteConfig.title).toBe("eslint-plugin-write-good-comments-2");
        expect(siteConfig.tagline).toMatch(/^Lint source comments\b/v);
        expect(siteConfig.tagline).toContain("readability");
        expect(siteConfig.projectName).toBe(
            "eslint-plugin-write-good-comments-2"
        );
        expect(siteConfig.organizationName).toBe("Nick2bad4u");
        expect(siteConfig.baseUrl).toBe(
            "/eslint-plugin-write-good-comments-2/"
        );
    });

    it("keeps the built-in blog disabled and docs routes enabled", () => {
        const presetOptions = getClassicPresetOptions(siteConfig);

        expect(presetOptions.blog).toBeFalsy();
        expect(presetOptions.docs?.routeBasePath).toBe("docs");
    });
});
