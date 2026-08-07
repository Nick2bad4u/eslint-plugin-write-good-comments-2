/**
 * @packageDocumentation
 * ESLint rule that checks source comments for difficult-to-read prose.
 */

import * as retextReadability from "retext-readability";

import type { JavaScriptRuleModule } from "../_internal/javascript-rule-module.js";

import {
    createCommentLintText,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";
import { resolveDefaultExport } from "../_internal/default-export.js";
import {
    createRetextMessageSourceLocation,
    lintMarkdownWithRetext,
} from "../_internal/retext.js";

/** Message ids emitted by this rule. */
type MessageIds = "problem";

/** Configurable rule options tuple. */
type Options = [ReadabilityCommentsOptions?];

/** Extra docs metadata carried by this plugin's rules. */
type PluginDocs = Readonly<{
    recommended: boolean;
}>;

/** Configurable readability rule options. */
type ReadabilityCommentsOptions = Readonly<{
    age?: number;
    minWords?: number;
    threshold?: number;
}>;

/** Default options for readability-comments. */
const defaultReadabilityCommentsOptions = {
    age: 16,
    minWords: 5,
    threshold: 4 / 7,
} as const satisfies ReadabilityCommentsOptions;

/** Create the runtime readability-comments rule. */
const readabilityCommentsRule: JavaScriptRuleModule<
    MessageIds,
    Options,
    PluginDocs
> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultReadabilityCommentsOptions] = context.options;

        const onProgram = (): void => {
            for (const comment of sourceCode.getAllComments()) {
                const lintText = createCommentLintText(comment);
                const trimmedLintText = lintText.trim();

                if (isIgnoredCommentText(trimmedLintText)) {
                    continue;
                }

                const messages = lintMarkdownWithRetext(
                    lintText,
                    (processor) => {
                        processor.use(resolveDefaultExport(retextReadability), {
                            age: options.age,
                            minWords: options.minWords,
                            threshold: options.threshold,
                        });
                    }
                );

                for (const message of messages) {
                    if (message.source === "retext-readability") {
                        context.report({
                            data: {
                                reason: message.reason.trim(),
                            },
                            loc: createRetextMessageSourceLocation(
                                comment,
                                sourceCode,
                                message
                            ),
                            messageId: "problem",
                        });
                    }
                }
            }
        };

        return { Program: onProgram };
    },
    meta: {
        defaultOptions: [defaultReadabilityCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "require comment prose to stay readable with retext-readability.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/readability-comments",
        },
        languages: ["js/js"],
        messages: {
            problem: "{{reason}}",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Optional readability thresholds for comment prose analysis.",
                properties: {
                    age: {
                        description:
                            "Target reader age used by the readability formula.",
                        minimum: 5,
                        type: "integer",
                    },
                    minWords: {
                        description:
                            "Minimum sentence length before readability analysis applies.",
                        minimum: 1,
                        type: "integer",
                    },
                    threshold: {
                        description:
                            "Maximum difficult-word ratio allowed before a sentence is reported.",
                        maximum: 1,
                        minimum: 0,
                        type: "number",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
};

export default readabilityCommentsRule;
