#!/usr/bin/env node

import { rm } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Remove one path recursively if it exists.
 *
 * @param {string} targetPath
 *
 * @returns {Promise<void>}
 */
const removePath = async (targetPath) => {
    if (targetPath.trim().length === 0) {
        return;
    }

    await rm(resolve(process.cwd(), targetPath), {
        force: true,
        recursive: true,
    });
};

const targetPaths = process.argv.slice(2);

await Promise.all(targetPaths.map((targetPath) => removePath(targetPath)));
