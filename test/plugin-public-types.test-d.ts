/**
 * @packageDocumentation
 * Type-level contract tests for public plugin exports.
 */

import { assertType } from "vitest";

import type {
    WriteGoodCommentsConfigName,
    WriteGoodCommentsPlugin,
    WriteGoodCommentsRuleId,
    WriteGoodCommentsRuleName,
} from "../src/plugin";

const validConfigName = "recommended";
const validWriteGoodRuleName = "write-good-comments";
const validWriteGoodRuleId = "write-good-comments/write-good-comments";
const validTaskRuleName = "task-comment-format";
const validTaskRuleId = "write-good-comments/task-comment-format";
const validInclusiveRuleName = "inclusive-language-comments";
const validInclusiveRuleId = "write-good-comments/inclusive-language-comments";
const validNoProfaneRuleName = "no-profane-comments";
const validNoProfaneRuleId = "write-good-comments/no-profane-comments";
const validSpellcheckRuleName = "spellcheck-comments";
const validSpellcheckRuleId = "write-good-comments/spellcheck-comments";
const validReadabilityRuleName = "readability-comments";
const validReadabilityRuleId = "write-good-comments/readability-comments";

assertType<WriteGoodCommentsConfigName>(validConfigName);
assertType<WriteGoodCommentsRuleName>(validWriteGoodRuleName);
assertType<WriteGoodCommentsRuleId>(validWriteGoodRuleId);
assertType<WriteGoodCommentsRuleName>(validTaskRuleName);
assertType<WriteGoodCommentsRuleId>(validTaskRuleId);
assertType<WriteGoodCommentsRuleName>(validInclusiveRuleName);
assertType<WriteGoodCommentsRuleId>(validInclusiveRuleId);
assertType<WriteGoodCommentsRuleName>(validNoProfaneRuleName);
assertType<WriteGoodCommentsRuleId>(validNoProfaneRuleId);
assertType<WriteGoodCommentsRuleName>(validSpellcheckRuleName);
assertType<WriteGoodCommentsRuleId>(validSpellcheckRuleId);
assertType<WriteGoodCommentsRuleName>(validReadabilityRuleName);
assertType<WriteGoodCommentsRuleId>(validReadabilityRuleId);

declare const pluginContract: WriteGoodCommentsPlugin;

assertType(pluginContract.configs.recommended);
assertType(pluginContract.configs.all);
assertType(pluginContract.configs);
