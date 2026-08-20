/** Preserve established ESLint peer floors and add only new dev majors. */
export declare const createPeerEslintRange: (
    existingPeerRange: unknown,
    devDependencyRange: string
) => string;
