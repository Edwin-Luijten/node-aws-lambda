import { S3 } from 'aws-sdk';

export enum Size {
    ONE_MB = 1024 * 1024,
    FIVE_MB = ONE_MB * 5,
}

export enum Mime {
    JPG = 'image/jpg',
    PNG = 'image/png',
}

export enum Ext {
    JPG = 'jpg',
    PNG = 'png',
}

export async function signedUploadUrl(s3: S3, key: string, expiration: number, size: number): Promise<S3.PresignedPost> {
    const ext = key.split('.').pop();

    return s3.createPresignedPost({
        Bucket: process.env.S3_BUCKET,
        Fields: {
            key: key,
        },
        Expires: expiration,
        Conditions: [
            ['content-length-range', 100, size], // 1MB
            ['starts-with', '$Content-Type', Mime[ext.toUpperCase()]],
        ]
    });
}