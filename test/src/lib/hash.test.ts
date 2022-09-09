import { hash } from '../../../src/lib/hash';

process.env.HASHING_KEY = 'bar';

const hashed = '147933218aaabc0b8b10a2b3a5c34684c8d94341bcf10a4736dc7270f7741851';

describe('Hash Lib Test', () => {
    test('Hash', () => {
        const a = hash('foo');

        expect(hashed).toStrictEqual(a);
    });
});