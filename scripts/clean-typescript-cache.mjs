#!/usr/bin/env node

import { readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const cacheDirectoryPath = resolve(process.cwd(), ".cache");

try {
    const cacheEntries = await readdir(cacheDirectoryPath, {
        withFileTypes: true,
    });

    const deleteOperations = [
        rm(resolve(cacheDirectoryPath, "builds"), {
            force: true,
            recursive: true,
        }),
    ];

    for (const cacheEntry of cacheEntries) {
        if (cacheEntry.isFile() && cacheEntry.name.endsWith(".tsbuildinfo")) {
            deleteOperations.push(
                rm(resolve(cacheDirectoryPath, cacheEntry.name), {
                    force: true,
                    recursive: false,
                })
            );
        }
    }

    await Promise.all(deleteOperations);
} catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        // The cache directory does not exist, so there is nothing to clean.
        process.exit(0);
    }

    throw error;
}
