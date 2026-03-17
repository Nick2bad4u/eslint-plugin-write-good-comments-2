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
const validRuleName = "write-good-comments";
const validRuleId = "write-good-comments/write-good-comments";

assertType<WriteGoodCommentsConfigName>(validConfigName);
assertType<WriteGoodCommentsRuleName>(validRuleName);
assertType<WriteGoodCommentsRuleId>(validRuleId);

declare const pluginContract: WriteGoodCommentsPlugin;

assertType<WriteGoodCommentsPresetConfig>(pluginContract.configs.recommended);
assertType<WriteGoodCommentsPresetConfig>(pluginContract.configs.all);
assertType<WriteGoodCommentsConfigs>(pluginContract.configs);
