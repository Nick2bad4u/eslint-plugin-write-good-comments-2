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
<<<<<<< HEAD
                    "Rule documentation for eslint-plugin-write-good-comments-2.",
||||||| 53124b2
                    "Rule documentation for every eslint-plugin-typefest rule.",
=======
                    "Rule documentation for eslint-plugin-write-good-comments.",
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
                title: "Rule Reference",
                type: "generated-index",
            },
            items: [
                {
<<<<<<< HEAD
                    id: "task-comment-format",
                    label: "R002 task-comment-format",
                    type: "doc",
                },
                {
||||||| 53124b2
                    className: "sb-cat-rules-ts-extras",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "ts-extras",
                    },
                    type: "category",
                    label: "ts-extras",
                    link: {
                        type: "generated-index",
                        title: "ts-extras Rules",
                        description:
                            "Rules that prefer ts-extras runtime helpers and utility functions.",
                    },
                    items: tsExtrasRuleItems,
                },
                {
                    className: "sb-cat-rules-type-fest",
                    collapsed: true,
                    collapsible: true,
                    customProps: {
                        badge: "type-fest",
                    },
                    type: "category",
                    label: "type-fest",
                    link: {
                        type: "generated-index",
                        title: "type-fest Rules",
                        description:
                            "Rules that prefer expressive type-fest utility types for clearer type-level code.",
                    },
                    items: typeFestRuleItems,
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
