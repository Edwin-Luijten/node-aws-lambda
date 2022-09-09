import { decrypt, encrypt } from '../../../src/lib/crypto';

const HEX_ENCRYPTION_KEY = '657ccd4dcd92e5585f44070ff5cd2f92';
process.env.HEX_ENCRYPTION_KEY = HEX_ENCRYPTION_KEY;

const ENCRYPTED = '84b35b0a1f9a178b02fb6b8397b620ff:7cc7de30baceb9214edb34442453d437';
const MINIMUM_SSL_VERSION = '1.1.1';
describe('Crypto Lib Test', () => {
  test('Missing HEX_ENCRYPTION_KEY environment', () => {
    delete process.env.HEX_ENCRYPTION_KEY;
    expect(() => encrypt('foo')).toThrow(Error);
    expect(() => decrypt('foo')).toThrow(Error);
    process.env.HEX_ENCRYPTION_KEY = HEX_ENCRYPTION_KEY;
  });

  test('Unsupported SSL version error', () => {
    Object.defineProperty(process.versions, 'openssl', {
      writable: true,
    });
    process.versions.openssl = '1.0.0';
    expect(() => encrypt('foo')).toThrow('OpenSSL Version too old, vulnerability to Heartbleed');
    process.versions.openssl = MINIMUM_SSL_VERSION;
  });

  test('Encrypt', () => {
    const a = encrypt('foo');
    const b = decrypt(a);

    expect('foo').toStrictEqual(b);
  });

  test('Decrypt', () => {
    expect(decrypt(ENCRYPTED)).toStrictEqual('foo');
  });

  test('Decrypt Failure', () => {
    // Decrypt invalid payload
    expect(() => decrypt('a')).toThrow('Invalid initialization vector');
    expect(() => decrypt('')).toThrow('Malformed payload');

    const a = encrypt('a');
    process.env.HEX_ENCRYPTION_KEY = 'b50b11f65907db9d2ad2b49f534242a9';

    // Decrypt with invalid encryption key
    expect(() => decrypt(a)).toThrow('error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
    process.env.HEX_ENCRYPTION_KEY = HEX_ENCRYPTION_KEY;
  });
});
