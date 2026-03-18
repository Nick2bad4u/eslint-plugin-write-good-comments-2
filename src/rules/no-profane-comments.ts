/**
 * @packageDocumentation
 * ESLint rule that checks source comments for profane wording.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import retextProfanities from "retext-profanities";
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

/** Message ids emitted by this rule. */
type MessageIds = "problem";

/** Configurable rule options. */
type NoProfaneCommentsOptions = Readonly<{
    allow?: readonly string[];
    deny?: readonly string[];
    profanitySureness?: 0 | 1 | 2;
}>;

/** Configurable rule options tuple. */
type Options = [NoProfaneCommentsOptions?];

/** Shared schema for retext rule-id lists. */
const retextRuleListSchema = {
    items: {
        minLength: 1,
        type: "string",
    },
    type: "array",
    uniqueItems: true,
} as const;

/** Default options for no-profane-comments. */
const defaultNoProfaneCommentsOptions: NoProfaneCommentsOptions = {};

/** Create the runtime no-profane-comments rule. */
const noProfaneCommentsRule: TSESLint.RuleModule<MessageIds, Options> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultNoProfaneCommentsOptions] = context.options;
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
                                resolveDefaultExport(retextProfanities),
                                {
                                    ...(isDefined(options.profanitySureness)
                                        ? {
                                              sureness:
                                                  options.profanitySureness,
                                          }
                                        : {}),
                                }
                            );
                        },
                        ruleFilter
                    )) {
                        if (message.source !== "retext-profanities") {
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
    defaultOptions: [defaultNoProfaneCommentsOptions],
    meta: {
        defaultOptions: [defaultNoProfaneCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "disallow profane wording in source comments with retext-profanities.",
            frozen: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/no-profane-comments",
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
                    "Optional retext profanity filters and minimum sureness for comment analysis.",
                properties: {
                    allow: {
                        ...retextRuleListSchema,
                        description:
                            "Retext profanity rule ids to suppress for this rule.",
                    },
                    deny: {
                        ...retextRuleListSchema,
                        description:
                            "Retext profanity rule ids to report exclusively for this rule.",
                    },
                    profanitySureness: {
                        description:
                            "Minimum retext profanity sureness to report: 0 (unlikely), 1 (maybe), or 2 (likely).",
                        enum: [
                            0,
                            1,
                            2,
                        ],
                        type: "integer",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
};

export default noProfaneCommentsRule;
