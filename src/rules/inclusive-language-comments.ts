/**
 * @packageDocumentation
 * ESLint rule that checks source comments for exclusionary or inconsiderate language.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import retextEquality from "retext-equality";
import { isDefined } from "ts-extras";

import {
    createCommentLintText,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";
import { resolveDefaultExport } from "../_internal/default-export.js";
import {
    createRetextMessageSourceLocation,
    lintMarkdownWithRetext,
} from "../_internal/retext.js";

/** Configurable rule options. */
type InclusiveLanguageCommentsOptions = Readonly<{
    allow?: readonly string[];
    deny?: readonly string[];
    noBinary?: boolean;
}>;

/** Message ids emitted by this rule. */
type MessageIds = "problem";

/** Configurable rule options tuple. */
type Options = [InclusiveLanguageCommentsOptions?];

/** Extra docs metadata carried by this plugin's rules. */
type PluginDocs = Readonly<{
    recommended: boolean;
}>;

/** Shared schema for retext rule-id lists. */
const retextRuleListSchema = {
    items: {
        minLength: 1,
        type: "string",
    },
    type: "array",
    uniqueItems: true,
} as const;

/** Default options for inclusive-language-comments. */
const defaultInclusiveLanguageCommentsOptions: InclusiveLanguageCommentsOptions =
    {};

/** Create the runtime inclusive-language-comments rule. */
const inclusiveLanguageCommentsRule: TSESLint.RuleModule<
    MessageIds,
    Options,
    PluginDocs
> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultInclusiveLanguageCommentsOptions] =
            context.options;
        const ruleFilter = {
            ...(isDefined(options.allow) ? { allow: options.allow } : {}),
            ...(isDefined(options.deny) ? { deny: options.deny } : {}),
        };

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    const lintText = createCommentLintText(comment);
                    const trimmedLintText = lintText.trim();

                    if (isIgnoredCommentText(trimmedLintText)) {
                        continue;
                    }

                    for (const message of lintMarkdownWithRetext(
                        lintText,
                        (processor) => {
                            processor.use(
                                resolveDefaultExport(retextEquality),
                                {
                                    binary: options.noBinary !== true,
                                }
                            );
                        },
                        ruleFilter
                    )) {
                        if (message.source !== "retext-equality") {
                            continue;
                        }

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
            },
        };
    },
    meta: {
        defaultOptions: [defaultInclusiveLanguageCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "enforce inclusive, considerate language in source comments with retext-equality.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/inclusive-language-comments",
        },
        messages: {
            problem: "{{reason}}",
        },
        schema: [
            {
                additionalProperties: false,
                allOf: [
                    {
                        not: {
                            required: ["allow", "deny"],
                            type: "object",
                        },
                        type: "object",
                    },
                ],
                description:
                    "Optional retext-equality filters and binary-language handling for comment analysis.",
                properties: {
                    allow: {
                        ...retextRuleListSchema,
                        description:
                            "Retext equality rule ids to suppress for this rule.",
                    },
                    deny: {
                        ...retextRuleListSchema,
                        description:
                            "Retext equality rule ids to report exclusively for this rule.",
                    },
                    noBinary: {
                        description:
                            "When true, binary pairings such as 'his or her' are also reported.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
};

export default inclusiveLanguageCommentsRule;
