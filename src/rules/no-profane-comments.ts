/**
 * @packageDocumentation
 * ESLint rule that checks source comments for profane wording.
 */

import * as retextProfanities from "retext-profanities";
import { isDefined } from "ts-extras";

import type { JavaScriptRuleModule } from "../_internal/javascript-rule-module.js";

import {
    createCommentProseLintText,
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
    profanitySureness?:
        | 0
        | 1
        | 2;
}>;

/** Configurable rule options tuple. */
type Options = [NoProfaneCommentsOptions?];

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

/** Default options for no-profane-comments. */
const defaultNoProfaneCommentsOptions: NoProfaneCommentsOptions = {};

/** Create the runtime no-profane-comments rule. */
const noProfaneCommentsRule: JavaScriptRuleModule<
    MessageIds,
    Options,
    PluginDocs
> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultNoProfaneCommentsOptions] = context.options;
        const ruleFilter = {
            ...(isDefined(options.allow) && { allow: options.allow }),
            ...(isDefined(options.deny) && { deny: options.deny }),
        };

        const onProgram = (): void => {
            for (const comment of sourceCode.getAllComments()) {
                const lintText = createCommentProseLintText(comment);
                const trimmedLintText = lintText.trim();

                if (isIgnoredCommentText(trimmedLintText)) {
                    continue;
                }

                const messages = lintMarkdownWithRetext(
                    lintText,
                    (processor) => {
                        processor.use(resolveDefaultExport(retextProfanities), {
                            ...(isDefined(options.profanitySureness) && {
                                sureness: options.profanitySureness,
                            }),
                        });
                    },
                    ruleFilter
                );

                for (const message of messages) {
                    if (message.source === "retext-profanities") {
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
        defaultOptions: [defaultNoProfaneCommentsOptions],
        deprecated: false,
        docs: {
            description:
                "disallow profane wording in source comments with retext-profanities.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-write-good-comments-2/docs/rules/no-profane-comments",
        },
        languages: ["js/js"],
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
