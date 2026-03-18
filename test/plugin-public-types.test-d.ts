/**
 * @packageDocumentation
 * Type-level contract tests for public plugin exports.
 */

import { assertType } from "vitest";

import type {
    WriteGoodCommentsConfigName,
    WriteGoodCommentsConfigs,
    WriteGoodCommentsPlugin,
    WriteGoodCommentsPresetConfig,
    WriteGoodCommentsRuleId,
    WriteGoodCommentsRuleName,
} from "../src/plugin";

const validConfigName = "recommended";
const validInclusiveRuleName = "inclusive-language-comments";
const validInclusiveRuleId = "write-good-comments/inclusive-language-comments";
const validNoProfaneRuleName = "no-profane-comments";
const validNoProfaneRuleId = "write-good-comments/no-profane-comments";
const validTaskRuleName = "task-comment-format";
const validTaskRuleId = "write-good-comments/task-comment-format";
const validRuleName = "write-good-comments";
const validRuleId = "write-good-comments/write-good-comments";

assertType<WriteGoodCommentsConfigName>(validConfigName);
assertType<WriteGoodCommentsRuleName>(validInclusiveRuleName);
assertType<WriteGoodCommentsRuleId>(validInclusiveRuleId);
assertType<WriteGoodCommentsRuleName>(validNoProfaneRuleName);
assertType<WriteGoodCommentsRuleId>(validNoProfaneRuleId);
assertType<WriteGoodCommentsRuleName>(validTaskRuleName);
assertType<WriteGoodCommentsRuleId>(validTaskRuleId);
assertType<WriteGoodCommentsRuleName>(validRuleName);
assertType<WriteGoodCommentsRuleId>(validRuleId);

declare const pluginContract: WriteGoodCommentsPlugin;

assertType<WriteGoodCommentsPresetConfig>(pluginContract.configs.recommended);
assertType<WriteGoodCommentsPresetConfig>(pluginContract.configs.all);
assertType<WriteGoodCommentsConfigs>(pluginContract.configs);
