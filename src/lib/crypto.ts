import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const AES_METHOD = 'aes-256-cbc';
const IV_LENGTH = 16;

export function encrypt(data: string): string {
    if (!process.env.HEX_ENCRYPTION_KEY) throw new Error('Missing environment variable: HEX_ENCRYPTION_KEY');
    if (process.versions.openssl <= '1.0.1f') {
        throw new Error('OpenSSL Version too old, vulnerability to Heartbleed');
    }

    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(AES_METHOD, Buffer.from(process.env.HEX_ENCRYPTION_KEY), iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(data: string): string {
    if (!process.env.HEX_ENCRYPTION_KEY) throw new Error('Missing environment variable: HEX_ENCRYPTION_KEY');

    const textParts = data.split(':');

    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(process.env.HEX_ENCRYPTION_KEY), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}