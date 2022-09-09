import * as crypto from 'crypto';
import { createHmac } from 'crypto';

export function hash(data: string): string {
    if (!process.env.HASHING_KEY || process.env.HASHING_KEY.length === 0) throw Error('Missing environment variable: HASHING_KEY');
    return createHmac('sha256', process.env.HASHING_KEY).update(data).digest('hex');
}

export function equals(a: string, b: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}