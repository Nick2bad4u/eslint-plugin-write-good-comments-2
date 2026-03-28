/**
 * @packageDocumentation
 * Sidebar structure for plugin rule documentation.
 */
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    rules: [
        {
            id: "overview",
            label: "📖 Rules Overview",
            type: "doc",
        },
        {
            id: "getting-started",
            label: "📖 Rules Getting Started",
            type: "doc",
        },
        {
            label: "🎛️ Presets",
            link: {
                id: "presets/index",
                type: "doc",
            },
            items: [
                {
                    id: "presets/recommended",
                    label: "🟡 Recommended preset",
                    type: "doc",
                },
                {
                    id: "presets/all",
                    label: "🟣 All rules preset",
                    type: "doc",
                },
            ],
            type: "category",
        },
        {
            label: "📏 Rules",
            link: {
                description:
                    "Browse the shipped rule reference for eslint-plugin-write-good-comments-2.",
                title: "Rule Reference",
                type: "generated-index",
            },
            items: [
                {
                    id: "write-good-comments",
                    label: "R001 ✍️ write-good-comments",
                    type: "doc",
                },
                {
                    id: "task-comment-format",
                    label: "R002 📝 task-comment-format",
                    type: "doc",
                },
                {
                    id: "inclusive-language-comments",
                    label: "R003 🌐 inclusive-language-comments",
                    type: "doc",
                },
                {
                    id: "no-profane-comments",
                    label: "R004 🚫 no-profane-comments",
                    type: "doc",
                },
                {
                    id: "spellcheck-comments",
                    label: "R005 🔤 spellcheck-comments",
                    type: "doc",
                },
                {
                    id: "readability-comments",
                    label: "R006 👓 readability-comments",
                    type: "doc",
                },
            ],
            type: "category",
        },
    ],
};

export default sidebars;
