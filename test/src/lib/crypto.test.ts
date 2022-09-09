import { decrypt, encrypt } from '../../../src/lib/crypto';

process.env.HEX_ENCRYPTION_KEY = '657ccd4dcd92e5585f44070ff5cd2f92';

const encrypted = '84b35b0a1f9a178b02fb6b8397b620ff:7cc7de30baceb9214edb34442453d437';

describe('Crypto Lib Test', () => {
    test('Encrypt', () => {
        const a = encrypt('foo');
        const b = decrypt(a);

        expect('foo').toStrictEqual(b);
    });

    test('Decrypt', () => {
        expect(decrypt(encrypted)).toStrictEqual('foo');
    });
});