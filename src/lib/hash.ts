import { createHmac } from 'crypto';
import * as crypto from 'crypto';

export function hash(data: string): string {
    return createHmac('sha256', process.env.HASHING_KEY).update(data).digest('hex');
}

export function equals(a: string, b: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}