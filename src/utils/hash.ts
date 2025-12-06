import * as crypto from 'crypto';

/**
 * @description This function is used to hash a plain text.
 * @param plainText - The plain text to hash.
 * @returns The hashed text.
 */
export function hash(plainText: string): string {
  return crypto.createHash('sha256').update(plainText).digest('hex') as string;
}
