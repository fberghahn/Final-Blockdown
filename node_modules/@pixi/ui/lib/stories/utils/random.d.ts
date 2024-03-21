/**
 * Creates a seeded random function similar to Math.random() based on given seed hash
 * @param seed - The hash string, can be anything
 * @returns Function that can be used instead Math.random
 */
export declare function randomSeeded(seed: string): () => number;
/**
 * Returns a random color
 * @param random - The random function to be used (defaults to Math.random)
 */
export declare function randomColor(random?: () => number): number;
/**
 * Returns a random number within a range
 * @param min - lowest number (inclusive)
 * @param max - highest number (exclusive)
 * @param random - The random function to be used (defaults to Math.random)
 */
export declare function randomRange(min: number, max: number, random?: () => number): number;
/**
 * Returns a random item from an object or array
 * @param obj - The object or array
 * @param random - The random function to be used (defaults to Math.random)
 */
export declare function randomItem<T>(obj: T, random?: () => number): T[keyof T];
/**
 * Returns a random boolean.
 * @param weight - The chance of true value, between 0 and 1
 * @param random - The random function to be used (defaults to Math.random)
 * @returns A random boolean
 */
export declare function randomBool(weight?: number, random?: () => number): boolean;
/**
 * Random shuffle an array in place, without cloning it
 * @param array - The array that will be shuffled
 * @param random - The random function to be used (defaults to Math.random)
 * @returns The same array, shuffled
 */
export declare function randomShuffle<T>(array: T[], random?: () => number): T[];
/**
 * Return a random string hash - not guaranteed to be unique
 * @param length - The length of the hash
 * @param random - The random function to be used (defaults to Math.random)
 * @param charset
 * @returns A random string hash
 */
export declare function randomHash(length: number, random?: () => number, charset?: string): string;
//# sourceMappingURL=random.d.ts.map