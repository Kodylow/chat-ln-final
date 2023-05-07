// utils/utils.ts
import crypto from 'crypto';
import { User } from './interfaces';

export const JWT_SECRET = 'your-jwt-secret';

export async function generateSecret(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
}

export function createHash(k1: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(k1);
  return hash.digest('hex');
}

const storage: Record<string, string | null> = {};

export async function storePair(
  hash: string,
  token: string | null,
): Promise<void> {
  storage[hash] = token;
}

export async function getPair(hash: string): Promise<string | null> {
  return storage[hash] || null;
}

export async function removeHashFromStore(hash: string): Promise<void> {
  delete storage[hash];
}

export function isValidK1(k1: string): boolean {
  return Object.prototype.hasOwnProperty.call(storage, k1);
}

export function createUser(key: string): User {
  // Your user creation implementation
  // Replace the example properties with the ones relevant to your application
  return {
    id: key,
    name: `User-${key.slice(0, 8)}`,
  };
}
