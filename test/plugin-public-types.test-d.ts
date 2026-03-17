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
<<<<<<< HEAD
const validTaskRuleName = "task-comment-format";
const validTaskRuleId = "write-good-comments/task-comment-format";
||||||| 53124b2
assertType<TypefestConfigName>(validConfigName);
// @ts-expect-error Invalid preset key must not satisfy TypefestConfigName.
assertType<TypefestConfigName>("recommendedTypeChecked");
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
const validRuleName = "write-good-comments";
const validRuleId = "write-good-comments/write-good-comments";

assertType<WriteGoodCommentsConfigName>(validConfigName);
<<<<<<< HEAD
assertType<WriteGoodCommentsRuleName>(validTaskRuleName);
assertType<WriteGoodCommentsRuleId>(validTaskRuleId);
||||||| 53124b2
const validRuleId = "typefest/prefer-type-fest-arrayable";
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
assertType<WriteGoodCommentsRuleName>(validRuleName);
assertType<WriteGoodCommentsRuleId>(validRuleId);

declare const pluginContract: WriteGoodCommentsPlugin;

assertType<WriteGoodCommentsPresetConfig>(pluginContract.configs.recommended);
assertType<WriteGoodCommentsPresetConfig>(pluginContract.configs.all);
assertType<WriteGoodCommentsConfigs>(pluginContract.configs);
