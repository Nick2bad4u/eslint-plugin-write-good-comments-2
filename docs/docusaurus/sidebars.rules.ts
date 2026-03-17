/**
 * @packageDocumentation
 * Sidebar structure for plugin rule documentation.
 */
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    rules: [
        {
            id: "overview",
            label: "Overview",
            type: "doc",
        },
        {
            id: "getting-started",
            label: "Getting Started",
            type: "doc",
        },
        {
            label: "Presets",
            link: {
                id: "presets/index",
                type: "doc",
            },
            items: [
                {
                    id: "presets/recommended",
                    label: "🟡 Recommended",
                    type: "doc",
                },
                {
                    id: "presets/all",
                    label: "🟣 All",
                    type: "doc",
                },
            ],
            type: "category",
        },
        {
            label: "Rules",
            link: {
                description:
                    "Rule documentation for eslint-plugin-write-good-comments.",
                title: "Rule Reference",
                type: "generated-index",
            },
            items: [
                {
                    id: "write-good-comments",
                    label: "R001 write-good-comments",
                    type: "doc",
                },
            ],
            type: "category",
        },
    ],
};

export default sidebars;
