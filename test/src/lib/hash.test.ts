import { equals, hash } from '../../../src/lib/hash';

const HASHING_KEY = 'bar';
process.env.HASHING_KEY = HASHING_KEY;

const hashed = '147933218aaabc0b8b10a2b3a5c34684c8d94341bcf10a4736dc7270f7741851';

describe('Hash Lib Test', () => {
    test('Missing HASHING_KEY environment', () => {
        delete process.env.HASHING_KEY;
        expect(() => hash('foo')).toThrow(Error);
        process.env.HASHING_KEY = HASHING_KEY;
    });

    test('Hash', () => {
        const a = hash('foo');

        expect(hashed).toStrictEqual(a);
    });

    test('Hash Equals', () => {
        expect(equals(hashed, hashed)).toBe(true);
    });

    test('Hash Not Equals', () => {
        const b = hashed + 'a';
        expect(() => equals(hashed, b)).toThrow('Input buffers must have the same byte length');
        expect(equals(hashed, hash('a'))).toBe(false);
    });
});