import process from "node:process";

import { ESLint } from "eslint";
import pc from "picocolors";

import plugin from "../plugin.mjs";

/**
 * @typedef {Readonly<{
 *     code: string;
 *     expectedMaximumMessages?: number;
 *     expectedMinimumMessages: number;
 *     name: string;
 *     ruleOptions?: readonly [Record<string, unknown>?];
 * }>} Scenario
 */

const ruleId = "write-good-comments/write-good-comments";
const expectedEslintMajorArgumentPrefix = "--expect-eslint-major=";
const smokeFilePath = "compat-smoke.ts";

/**
 * @param {readonly string[]} argv
 *
 * @returns {number | undefined}
 */
const parseExpectedEslintMajor = (argv) => {
    const matchingArgument = argv.find((argument) =>
        argument.startsWith(expectedEslintMajorArgumentPrefix)
    );

    if (matchingArgument === undefined) {
        return undefined;
    }

    const majorString = matchingArgument.slice(
        expectedEslintMajorArgumentPrefix.length
    );

    if (majorString.length === 0) {
        throw new Error(
            `Missing ESLint major value in argument: ${matchingArgument}`
        );
    }

    const majorValue = Number.parseInt(majorString, 10);

    if (Number.isNaN(majorValue)) {
        throw new Error(
            `Invalid ESLint major value in argument: ${matchingArgument}`
        );
    }

    return majorValue;
};

/**
 * @param {number | undefined} expectedMajor
 */
const assertEslintMajor = (expectedMajor) => {
    const runtimeVersion = ESLint.version;

    if (typeof runtimeVersion !== "string" || runtimeVersion.length === 0) {
        throw new Error(
            `Unable to determine ESLint runtime version: ${String(runtimeVersion)}`
        );
    }

    const [runtimeMajorText] = runtimeVersion.split(".", 1);

    if (runtimeMajorText === undefined || runtimeMajorText.length === 0) {
        throw new Error(
            `Unable to parse ESLint runtime version: ${runtimeVersion}`
        );
    }

    const runtimeMajor = Number.parseInt(runtimeMajorText, 10);

    if (Number.isNaN(runtimeMajor)) {
        throw new Error(
            `Unable to parse ESLint runtime version: ${runtimeVersion}`
        );
    }

    if (expectedMajor !== undefined && runtimeMajor !== expectedMajor) {
        throw new Error(
            `Expected ESLint major ${expectedMajor}, but detected ${runtimeVersion}.`
        );
    }

    console.log(
        `${pc.green("✓")} ESLint runtime ${pc.bold(runtimeVersion)} detected for compatibility smoke checks.`
    );
};

/**
 * @param {readonly [Record<string, unknown>?] | undefined} ruleOptions
 *
 * @returns {import("eslint").Linter.Config[]}
 */
const createCompatibilityConfig = (ruleOptions) => {
    const recommendedConfig = plugin.configs?.["recommended"];

    if (recommendedConfig === undefined) {
        throw new Error(
            "Plugin recommended config is unavailable. Compatibility smoke test cannot continue."
        );
    }

    const baseConfig = /** @type {import("eslint").Linter.Config} */ (
        recommendedConfig
    );
    const configuredRules =
        /** @type {NonNullable<import("eslint").Linter.Config["rules"]>} */ ({
            [ruleId]:
                ruleOptions === undefined ? "error" : ["error", ...ruleOptions],
        });

    return [
        {
            ...baseConfig,
            files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
            name: `compat-smoke:${ruleId}`,
            plugins: {
                "write-good-comments": plugin,
            },
            rules: {
                ...(baseConfig.rules ?? {}),
                ...configuredRules,
            },
        },
    ];
};

/**
 * @param {Scenario} scenario
 */
const runScenario = async ({
    code,
    expectedMaximumMessages,
    expectedMinimumMessages,
    name,
    ruleOptions,
}) => {
    const eslint = new ESLint({
        fix: false,
        ignore: false,
        overrideConfig: createCompatibilityConfig(ruleOptions),
        overrideConfigFile: true,
    });

    const lintResults = await eslint.lintText(code, {
        filePath: smokeFilePath,
        warnIgnored: false,
    });

    const fatalMessages = lintResults.flatMap((result) =>
        result.messages.filter((message) => message.fatal === true)
    );

    if (fatalMessages.length > 0) {
        throw new Error(
            `${name}: encountered fatal parse/runtime diagnostics (${fatalMessages.length}).`
        );
    }

    const matchingMessages = lintResults.flatMap((result) =>
        result.messages.filter((message) => message.ruleId === ruleId)
    );

    if (matchingMessages.length < expectedMinimumMessages) {
        throw new Error(
            `${name}: expected at least ${expectedMinimumMessages} ${ruleId} message(s), received ${matchingMessages.length}.`
        );
    }

    if (
        expectedMaximumMessages !== undefined &&
        matchingMessages.length > expectedMaximumMessages
    ) {
        throw new Error(
            `${name}: expected at most ${expectedMaximumMessages} ${ruleId} message(s), received ${matchingMessages.length}.`
        );
    }

    console.log(
        `${pc.green("✓")} ${pc.bold(name)} ${pc.gray("->")} ${pc.bold(ruleId)} produced ${pc.magenta(String(matchingMessages.length))} message(s).`
    );
};

const scenarios = /** @type {const} */ ([
    {
        code: String.raw`// This is very very obviously basically bad.
export const value = 1;
`,
        expectedMinimumMessages: 1,
        name: "comment-detection",
    },
    {
        code: String.raw`// eslint-disable-next-line no-console
console.log("ok");
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "directive-comment-ignored",
    },
    {
        code: String.raw`// This whitelist token is AcmeWidget.
export const value = 1;
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "whitelist-option",
        ruleOptions: [{ whitelist: ["AcmeWidget"] }],
    },
]);

console.log(pc.bold(pc.cyan("Running ESLint 9 compatibility smoke checks...")));

const expectedEslintMajor = parseExpectedEslintMajor(process.argv.slice(2));
assertEslintMajor(expectedEslintMajor);

for (const scenario of scenarios) {
    await runScenario(scenario);
}

console.log(pc.bold(pc.green("ESLint 9 compatibility smoke checks passed.")));
