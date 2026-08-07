import { spawnSync } from "node:child_process";
import process from "node:process";

/** Environment key propagated by a parent npm process from legacy user config. */
const inheritedAllowScriptsKey = "npm_config_allow_scripts";

/** Preserve all environment values except the incompatible inherited setting. */
const auditEnvironment = Object.fromEntries(
    Object.entries(process.env).filter(
        ([key]) => key.toLowerCase() !== inheritedAllowScriptsKey
    )
);
const npmCliPath = process.env["npm_execpath"];

if (npmCliPath === undefined || npmCliPath.length === 0) {
    throw new Error(
        "npm_execpath is unavailable; run this check via npm run audit."
    );
}

const auditResult = spawnSync(
    process.execPath,
    [
        npmCliPath,
        "audit",
        "--audit-level=low",
    ],
    {
        cwd: process.cwd(),
        env: auditEnvironment,
        stdio: "inherit",
    }
);

if (auditResult.error !== undefined) {
    throw new Error("Unable to start npm audit.", {
        cause: auditResult.error,
    });
}

process.exitCode = auditResult.status ?? 1;
