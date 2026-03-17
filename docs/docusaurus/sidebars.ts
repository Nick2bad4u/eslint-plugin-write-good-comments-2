/**
 * @packageDocumentation
 * Sidebar structure for the primary documentation section under `docs/`.
 */
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    docs: [
        {
            id: "intro",
            label: "Overview",
            type: "doc",
        },
        {
            id: "getting-started",
            label: "Getting Started",
            type: "doc",
        },
        {
            id: "developer/index",
            label: "Developer Notes",
            type: "doc",
        },
    ],
};

export default sidebars;
