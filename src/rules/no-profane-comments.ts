/**
 * @packageDocumentation
 * ESLint rule that checks source comments for profane wording.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import {
    type AlexMarkdownOptions,
    createAlexMessageSourceLocation,
    lintMarkdownWithAlex,
} from "../_internal/alex.js";
import {
    createCommentLintText,
    isIgnoredCommentText,
} from "../_internal/comment-prose.js";

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

/** Shared schema for alex rule-id lists. */
const alexRuleListSchema = {
    items: {
        minLength: 1,
        type: "string",
    },
    type: "array",
    uniqueItems: true,
} as const;

/** Default options for no-profane-comments. */
const defaultNoProfaneCommentsOptions =
    {} as const satisfies NoProfaneCommentsOptions;

/** Convert public rule options into alex markdown options. */
const createAlexOptions = (
    options: Readonly<NoProfaneCommentsOptions>
): AlexMarkdownOptions => ({
    ...(options.allow === undefined ? {} : { allow: options.allow }),
    ...(options.deny === undefined ? {} : { deny: options.deny }),
    ...(options.profanitySureness === undefined
        ? {}
        : {
              profanitySureness: options.profanitySureness,
          }),
});

/** Create the runtime no-profane-comments rule. */
const noProfaneCommentsRule: TSESLint.RuleModule<MessageIds, Options> = {
    create(context) {
        const sourceCode = context.sourceCode;
        const [options = defaultNoProfaneCommentsOptions] = context.options;
        const alexOptions = createAlexOptions(options);

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    const lintText = createCommentLintText(comment);
                    const trimmedLintText = lintText.trim();

                    if (isIgnoredCommentText(trimmedLintText)) {
                        continue;
                    }

                    for (const message of lintMarkdownWithAlex(
                        lintText,
                        alexOptions
                    )) {
                        if (message.source !== "retext-profanities") {
                            continue;
                        }

                        context.report({
                            data: {
                                reason: message.reason.trim(),
                            },
                            loc: createAlexMessageSourceLocation(
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
                "disallow profane wording in source comments with alex.",
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
                    "Optional alex profanity filters and minimum sureness for comment analysis.",
                properties: {
                    allow: {
                        ...alexRuleListSchema,
                        description:
                            "Alex profanity rule ids to suppress for this rule.",
                    },
                    deny: {
                        ...alexRuleListSchema,
                        description:
                            "Alex profanity rule ids to report exclusively for this rule.",
                    },
                    profanitySureness: {
                        description:
                            "Minimum alex profanity sureness to report: 0 (unlikely), 1 (maybe), or 2 (likely).",
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
