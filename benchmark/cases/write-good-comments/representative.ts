/**
 * Representative benchmark fixture for comment-analysis rules.
 *
 * This fixture intentionally mixes ordinary prose with known diagnostic cases
 * so benchmarks exercise both ignored comments and complete report paths.
 */

// TODO
// The whitelist is updated by the legacy synchronization job.
// This damn fallback stays until all clients use the supported API.
// The response was validated by the adapter before it was stored.
// Rehydrate the recieve buffer before parsing the next batch.
// Keep this branch because the legacy service omits optional profile fields.
// Convert the payload once here so downstream consumers share one representation.
// A short note.
// The cache entry is read, normalized, validated, transformed, and returned to the caller after every request even when no field changed and the prior normalized value could be reused safely.

export const normalizeBenchmarkValue = (value: string): string => value.trim();
