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
<<<<<<< HEAD
 *     ruleId: string;
||||||| 53124b2
 *     ruleId: string;
 *     typed: boolean;
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
 *     ruleOptions?: readonly [Record<string, unknown>?];
 * }>} Scenario
 */

<<<<<<< HEAD
||||||| 53124b2
/**
 * @typedef {Record<string, unknown>} UnknownRecord
 */

const scriptsDirectoryPath = fileURLToPath(new URL(".", import.meta.url));
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");
const typedFixturePath = path.resolve(
    repositoryRootPath,
    "test/fixtures/typed/prefer-ts-extras-safe-cast-to.invalid.ts"
);
const arrayableFixturePath = path.resolve(
    repositoryRootPath,
    "test/fixtures/typed/prefer-type-fest-arrayable.invalid.ts"
);

=======
const ruleId = "write-good-comments/write-good-comments";
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
const expectedEslintMajorArgumentPrefix = "--expect-eslint-major=";
const smokeFilePath = "compat-smoke.ts";
<<<<<<< HEAD

const pluginRuleIds = Object.freeze(
    Object.keys(plugin.rules ?? {}).map(
        (ruleName) => `write-good-comments/${ruleName}`
    )
);
||||||| 53124b2

/**
 * @param {string} filePath
 *
 * @returns {string}
 */
const toPosixPath = (filePath) => filePath.replaceAll("\\", "/");

/**
 * @param {unknown} value
 *
 * @returns {readonly string[]}
 */
const collectStringEntries = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((entry) => typeof entry === "string");
};

/**
 * @param {unknown} value
 *
 * @returns {value is UnknownRecord}
 */
const isUnknownRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647

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
<<<<<<< HEAD
 * @param {string} selectedRuleId
||||||| 53124b2
 * @param {string} fixturePath
 */
const assertFixtureExists = (fixturePath) => {
    if (!existsSync(fixturePath)) {
        throw new Error(`Missing fixture file: ${fixturePath}`);
    }
};

/**
 * @param {string} ruleId
 * @param {boolean} typed
 * @param {string} fixturePath
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
 * @param {readonly [Record<string, unknown>?] | undefined} ruleOptions
 *
 * @returns {import("eslint").Linter.Config[]}
 */
<<<<<<< HEAD
const createCompatibilityConfig = (selectedRuleId, ruleOptions) => {
||||||| 53124b2
const createCompatibilityConfig = (ruleId, typed, fixturePath) => {
=======
const createCompatibilityConfig = (ruleOptions) => {
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
    const recommendedConfig = plugin.configs?.["recommended"];

    if (recommendedConfig === undefined) {
        throw new Error(
            "Plugin recommended config is unavailable. Compatibility smoke test cannot continue."
        );
    }

    const baseConfig = /** @type {import("eslint").Linter.Config} */ (
        recommendedConfig
<<<<<<< HEAD
    );
    const pluginRuleOverrides = Object.fromEntries(
        pluginRuleIds.map((ruleId) => [ruleId, "off"])
||||||| 53124b2
    const baseLanguageOptions = isUnknownRecord(
        recommendedConfig["languageOptions"]
    )
        ? recommendedConfig["languageOptions"]
        : {};

    const baseParserOptions = isUnknownRecord(
        baseLanguageOptions["parserOptions"]
    )
        ? baseLanguageOptions["parserOptions"]
        : {};
    const baseProjectServiceOptions = isUnknownRecord(
        baseParserOptions["projectService"]
    )
        ? baseParserOptions["projectService"]
        : {};
    const relativeFixturePath = toPosixPath(
        path.relative(repositoryRootPath, fixturePath)
    );
    const existingAllowDefaultProject = collectStringEntries(
        baseProjectServiceOptions["allowDefaultProject"]
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
    );
    const configuredRules =
        /** @type {NonNullable<import("eslint").Linter.Config["rules"]>} */ ({
<<<<<<< HEAD
            ...pluginRuleOverrides,
            [selectedRuleId]:
||||||| 53124b2
=======
            [ruleId]:
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
                ruleOptions === undefined ? "error" : ["error", ...ruleOptions],
        });

    return [
        {
            ...baseConfig,
            files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
<<<<<<< HEAD
            name: `compat-smoke:${selectedRuleId}`,
||||||| 53124b2
            ...recommendedConfig,
            files: ["**/*.{ts,tsx,mts,cts}"],
            languageOptions: {
                ...baseLanguageOptions,
                parser: tsParser,
                parserOptions: {
                    ...baseParserOptions,
                    ecmaVersion: "latest",
                    sourceType: "module",
                    tsconfigRootDir: repositoryRootPath,
                    ...(typed
                        ? {
                              projectService: {
                                  ...baseProjectServiceOptions,
                                  allowDefaultProject: [
                                      ...new Set([
                                          ...existingAllowDefaultProject,
                                          relativeFixturePath,
                                      ]),
                                  ],
                                  defaultProject: "tsconfig.eslint.json",
                              },
                          }
                        : {}),
                },
            },
            name: `compat-smoke:${ruleId}`,
=======
            name: `compat-smoke:${ruleId}`,
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
<<<<<<< HEAD
    ruleId,
||||||| 53124b2
    ruleId,
    typed,
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
    ruleOptions,
}) => {
    const eslint = new ESLint({
        fix: false,
        ignore: false,
<<<<<<< HEAD
        overrideConfig: createCompatibilityConfig(ruleId, ruleOptions),
||||||| 53124b2
        overrideConfig: createCompatibilityConfig(ruleId, typed, fixturePath),
=======
        overrideConfig: createCompatibilityConfig(ruleOptions),
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
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
<<<<<<< HEAD
        ruleId: "write-good-comments/write-good-comments",
||||||| 53124b2
        fix: false,
        fixturePath: typedFixturePath,
        name: "typed-detection",
        ruleId: "typefest/prefer-ts-extras-safe-cast-to",
        typed: true,
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
    },
    {
        code: String.raw`// eslint-disable-next-line no-console
console.log("ok");
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "directive-comment-ignored",
<<<<<<< HEAD
        ruleId: "write-good-comments/write-good-comments",
||||||| 53124b2
        expectedOutputIncludes: ["safeCastTo<"],
        fix: true,
        fixturePath: typedFixturePath,
        name: "typed-autofix",
        ruleId: "typefest/prefer-ts-extras-safe-cast-to",
        typed: true,
=======
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
    },
    {
        code: String.raw`// This whitelist token is AcmeWidget.
export const value = 1;
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "whitelist-option",
<<<<<<< HEAD
        ruleId: "write-good-comments/write-good-comments",
        ruleOptions: [{ whitelist: ["AcmeWidget"] }],
    },
    {
        code: String.raw`// TODO
export const value = 1;
`,
        expectedMaximumMessages: 1,
        expectedMinimumMessages: 1,
        name: "task-comment-detection",
        ruleId: "write-good-comments/task-comment-format",
    },
    {
        code: String.raw`// TODO: follow up on the release notes before publishing
export const value = 1;
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "task-comment-description-accepted",
        ruleId: "write-good-comments/task-comment-format",
||||||| 53124b2
        expectedMinimumMessages: 1,
        fix: false,
        fixturePath: arrayableFixturePath,
        name: "non-typed-detection",
        ruleId: "typefest/prefer-type-fest-arrayable",
        typed: false,
=======
        ruleOptions: [{ whitelist: ["AcmeWidget"] }],
>>>>>>> 107ff1efe6ba025fe69e29186ccfcdb4a3a18647
    },
]);

console.log(pc.bold(pc.cyan("Running ESLint 9 compatibility smoke checks...")));

const expectedEslintMajor = parseExpectedEslintMajor(process.argv.slice(2));
assertEslintMajor(expectedEslintMajor);

for (const scenario of scenarios) {
    await runScenario(scenario);
}

console.log(pc.bold(pc.green("ESLint 9 compatibility smoke checks passed.")));
