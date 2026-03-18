/**
 * @packageDocumentation
 * ESLint rule that checks source comments for exclusionary or inconsiderate language.
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

/** Shared schema for alex rule-id lists. */
const alexRuleListSchema = {
    items: {
        minLength: 1,
        type: "string",
    },
    type: "array",
    uniqueItems: true,
} as const;

/** Default options for inclusive-language-comments. */
const defaultInclusiveLanguageCommentsOptions =
    {} as const satisfies InclusiveLanguageCommentsOptions;

/** Convert public rule options into alex markdown options. */
const createAlexOptions = (
    options: Readonly<InclusiveLanguageCommentsOptions>
): AlexMarkdownOptions => ({
    ...(options.allow === undefined ? {} : { allow: options.allow }),
    ...(options.deny === undefined ? {} : { deny: options.deny }),
    ...(options.noBinary === undefined
        ? {}
        : {
              noBinary: options.noBinary,
          }),
});

/** Create the runtime inclusive-language-comments rule. */
const inclusiveLanguageCommentsRule: TSESLint.RuleModule<MessageIds, Options> =
    {
        create(context) {
            const sourceCode = context.sourceCode;
            const [options = defaultInclusiveLanguageCommentsOptions] =
                context.options;
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
                            if (message.source !== "retext-equality") {
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
        defaultOptions: [defaultInclusiveLanguageCommentsOptions],
        meta: {
            defaultOptions: [defaultInclusiveLanguageCommentsOptions],
            deprecated: false,
            docs: {
                description:
                    "enforce inclusive, considerate language in source comments with alex.",
                frozen: false,
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
                        "Optional alex equality filters and binary-language handling for comment analysis.",
                    properties: {
                        allow: {
                            ...alexRuleListSchema,
                            description:
                                "Alex equality rule ids to suppress for this rule.",
                        },
                        deny: {
                            ...alexRuleListSchema,
                            description:
                                "Alex equality rule ids to report exclusively for this rule.",
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
