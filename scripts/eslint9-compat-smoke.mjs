import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pc from "picocolors";

/**
 * @typedef {Readonly<{
 *     code: string;
 *     expectedMaximumMessages?: number;
 *     expectedMinimumMessages: number;
 *     name: string;
 *     ruleId: string;
 *     ruleOptions?: readonly [Record<string, unknown>?];
 * }>} Scenario
 */

const expectedEslintMajorArgumentPrefix = "--expect-eslint-major=";
const consumerEslintVersionArgumentPrefix = "--consumer-eslint-version=";
const consumerEslintJsVersionArgumentPrefix = "--consumer-eslint-js-version=";
const smokeFilePath = "compat-smoke.ts";
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * @param {readonly string[]} argv
 * @param {string} prefix
 *
 * @returns {string | undefined}
 */
const getArgumentValue = (argv, prefix) => {
    const matchingArgument = argv.find((argument) =>
        argument.startsWith(prefix)
    );

    if (matchingArgument === undefined) {
        return undefined;
    }

    const value = matchingArgument.slice(prefix.length);

    if (value.length === 0) {
        throw new TypeError(`Missing value in argument: ${matchingArgument}`);
    }

    return value;
};

/**
 * @param {readonly string[]} argv
 *
 * @returns {number | undefined}
 */
const parseExpectedEslintMajor = (argv) => {
    const majorString =
        getArgumentValue(argv, expectedEslintMajorArgumentPrefix) ??
        process.env["EXPECTED_ESLINT_MAJOR"];

    if (majorString === undefined) {
        return undefined;
    }

    const majorValue = Number.parseInt(majorString, 10);

    if (Number.isNaN(majorValue)) {
        throw new TypeError(
            `Invalid ESLint major value in argument: ${majorString}`
        );
    }

    return majorValue;
};

/**
 * @param {readonly string[]} arguments_ CLI arguments.
 *
 * @returns {Promise<
 *     Readonly<{
 *         ESLint: typeof import("eslint").ESLint;
 *         plugin: typeof import("../plugin.mjs").default;
 *     }>
 * >}
 */
const loadCompatibilityRuntime = async (arguments_) => {
    const eslintVersion =
        getArgumentValue(arguments_, consumerEslintVersionArgumentPrefix) ??
        process.env["COMPAT_ESLINT_VERSION"];
    const eslintJsVersion =
        getArgumentValue(arguments_, consumerEslintJsVersionArgumentPrefix) ??
        process.env["COMPAT_ESLINT_JS_VERSION"];

    if ((eslintVersion === undefined) !== (eslintJsVersion === undefined)) {
        throw new Error(
            "Consumer ESLint and @eslint/js versions must be provided together."
        );
    }

    if (eslintVersion === undefined || eslintJsVersion === undefined) {
        const [{ ESLint }, { default: plugin }] = await Promise.all([
            import("eslint"),
            import("../plugin.mjs"),
        ]);

        return { ESLint, plugin };
    }

    const npmCliPath = process.env["npm_execpath"];

    if (npmCliPath === undefined || npmCliPath.length === 0) {
        throw new Error(
            "npm_execpath is unavailable; run this check via npm run lint:compat:eslint9."
        );
    }

    const rootPackage =
        /**
         * @type {Readonly<{
         *     name: string;
         *     packageManager: string;
         * }>}
         */ (
            JSON.parse(
                readFileSync(join(repositoryRoot, "package.json"), "utf8")
            )
        );
    const consumerRoot = join(repositoryRoot, "temp", "eslint9-consumer");
    const npmEnvironment = Object.fromEntries(
        Object.entries(process.env).filter(
            ([key]) => key.toLowerCase() !== "npm_config_allow_scripts"
        )
    );

    rmSync(consumerRoot, { force: true, recursive: true });
    mkdirSync(consumerRoot, { recursive: true });

    const packResult = spawnSync(
        process.execPath,
        [
            npmCliPath,
            "pack",
            "--json",
            "--pack-destination",
            consumerRoot,
        ],
        {
            cwd: repositoryRoot,
            encoding: "utf8",
            env: npmEnvironment,
        }
    );

    if (packResult.error !== undefined) {
        throw new Error("Unable to start npm pack for the ESLint consumer.", {
            cause: packResult.error,
        });
    }

    if (packResult.status !== 0) {
        throw new Error(
            `npm pack failed for the ESLint consumer:\n${packResult.stderr}`
        );
    }

    const packMetadata = /** @type {unknown} */ (JSON.parse(packResult.stdout));
    const packEntries = Array.isArray(packMetadata)
        ? packMetadata
        : Object.values(
              /** @type {Readonly<Record<string, unknown>>} */ (packMetadata)
          );
    const firstPackEntry = packEntries[0];

    if (
        typeof firstPackEntry !== "object" ||
        firstPackEntry === null ||
        !("filename" in firstPackEntry) ||
        typeof firstPackEntry.filename !== "string"
    ) {
        throw new TypeError(
            "npm pack metadata did not contain a tarball filename."
        );
    }

    const consumerPackage = {
        allowScripts: {},
        dependencies: {
            "@eslint/js": eslintJsVersion,
            eslint: eslintVersion,
            [rootPackage.name]: `file:./${firstPackEntry.filename}`,
        },
        name: "eslint9-compat-consumer",
        packageManager: rootPackage.packageManager,
        private: true,
        type: "module",
        version: "0.0.0",
    };

    writeFileSync(
        join(consumerRoot, "package.json"),
        `${JSON.stringify(consumerPackage, undefined, 4)}\n`
    );
    writeFileSync(
        join(consumerRoot, ".npmrc"),
        [
            "allow-git=none",
            "allow-remote=none",
            "strict-allow-scripts=true",
            "",
        ].join("\n")
    );

    const installResult = spawnSync(
        process.execPath,
        [
            npmCliPath,
            "install",
            "--no-audit",
            "--no-fund",
        ],
        {
            cwd: consumerRoot,
            env: npmEnvironment,
            stdio: "inherit",
        }
    );

    if (installResult.error !== undefined) {
        throw new Error(
            "Unable to start npm install for the ESLint consumer.",
            { cause: installResult.error }
        );
    }

    if (installResult.status !== 0) {
        throw new Error(
            `npm install failed for ESLint ${eslintVersion} without peer overrides.`
        );
    }

    const installScriptsResult = spawnSync(
        process.execPath,
        [
            npmCliPath,
            "install-scripts",
            "ls",
            "--json",
        ],
        {
            cwd: consumerRoot,
            encoding: "utf8",
            env: npmEnvironment,
        }
    );

    if (installScriptsResult.error !== undefined) {
        throw new Error(
            "Unable to inspect pending ESLint consumer install scripts.",
            { cause: installScriptsResult.error }
        );
    }

    if (installScriptsResult.status !== 0) {
        throw new Error(
            `Unable to inspect ESLint consumer install scripts:\n${installScriptsResult.stderr}`
        );
    }

    const installScripts =
        /** @type {Readonly<{ allowScripts?: unknown[] }>} */ (
            JSON.parse(installScriptsResult.stdout)
        );

    if ((installScripts.allowScripts?.length ?? 0) > 0) {
        throw new Error(
            `Unexpected pending ESLint consumer install scripts:\n${installScriptsResult.stdout}`
        );
    }

    const consumerRequire = createRequire(join(consumerRoot, "package.json"));
    const eslintModule = /** @type {typeof import("eslint")} */ (
        consumerRequire("eslint")
    );
    const plugin = /** @type {typeof import("../plugin.mjs").default} */ (
        consumerRequire(rootPackage.name)
    );

    return { ESLint: eslintModule.ESLint, plugin };
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
        throw new TypeError(
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
 * @param {string} selectedRuleId
 * @param {readonly [Record<string, unknown>?] | undefined} ruleOptions
 *
 * @returns {import("eslint").Linter.Config[]}
 */
const createCompatibilityConfig = (selectedRuleId, ruleOptions) => {
    const recommendedConfig = plugin.configs?.["recommended"];

    if (recommendedConfig === undefined) {
        throw new Error(
            "Plugin recommended config is unavailable. Compatibility smoke test cannot continue."
        );
    }

    const baseConfig = /** @type {import("eslint").Linter.Config} */ (
        recommendedConfig
    );
    const pluginRuleOverrides = Object.fromEntries(
        pluginRuleIds.map((ruleId) => [ruleId, "off"])
    );
    const baseRules = baseConfig.rules;
    const configuredRules =
        /** @type {NonNullable<import("eslint").Linter.Config["rules"]>} */ ({
            ...pluginRuleOverrides,
            [selectedRuleId]:
                ruleOptions === undefined ? "error" : ["error", ...ruleOptions],
        });

    return [
        {
            ...baseConfig,
            files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
            name: `compat-smoke:${selectedRuleId}`,
            plugins: {
                "write-good-comments": plugin,
            },
            rules:
                baseRules === undefined
                    ? configuredRules
                    : {
                          ...baseRules,
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
    ruleId,
    ruleOptions,
}) => {
    const eslint = new ESLint({
        fix: false,
        ignore: false,
        overrideConfig: createCompatibilityConfig(ruleId, ruleOptions),
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
        code: `// This is very very obviously basically bad.
export const value = 1;
`,
        expectedMinimumMessages: 1,
        name: "comment-detection",
        ruleId: "write-good-comments/write-good-comments",
    },
    {
        code: `// eslint-disable-next-line no-console
console.log("ok");
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "directive-comment-ignored",
        ruleId: "write-good-comments/write-good-comments",
    },
    {
        code: `// This whitelist token is AcmeWidget.
export const value = 1;
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "whitelist-option",
        ruleId: "write-good-comments/write-good-comments",
        ruleOptions: [{ whitelist: ["AcmeWidget"] }],
    },
    {
        code: `// TODO
export const value = 1;
`,
        expectedMaximumMessages: 1,
        expectedMinimumMessages: 1,
        name: "task-comment-detection",
        ruleId: "write-good-comments/task-comment-format",
    },
    {
        code: `// TODO: follow up on the release notes before publishing
export const value = 1;
`,
        expectedMaximumMessages: 0,
        expectedMinimumMessages: 0,
        name: "task-comment-description-accepted",
        ruleId: "write-good-comments/task-comment-format",
    },
]);

const arguments_ = process.argv.slice(2);
const { ESLint, plugin } = await loadCompatibilityRuntime(arguments_);
const pluginRuleIds = Object.freeze(
    Object.keys(plugin.rules ?? {}).map(
        (ruleName) => `write-good-comments/${ruleName}`
    )
);

console.log(pc.bold(pc.cyan("Running ESLint 9 compatibility smoke checks...")));

const expectedEslintMajor = parseExpectedEslintMajor(arguments_);
assertEslintMajor(expectedEslintMajor);

for (const scenario of scenarios) {
    await runScenario(scenario);
}

console.log(pc.bold(pc.green("ESLint 9 compatibility smoke checks passed.")));
