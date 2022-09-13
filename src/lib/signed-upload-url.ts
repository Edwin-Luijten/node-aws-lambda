import { S3 } from 'aws-sdk';

export const Size = {
    ONE_MB: 1024 * 1024,
    FIVE_MB: (1024 * 1024) * 5,
} as {[key: string]: number }

export const Mime = {
    JPG: 'image/jpg',
    PNG: 'image/png',
} as {[key: string]: string }

export const Ext = {
    JPG: 'jpg',
    PNG: 'png',
} as {[key: string]: string }

export const signedUploadUrl = async (s3: S3, key: string, expiration: number, size: number): Promise<S3.PresignedPost> => {
  const ext = key.split('.').pop();

  if (!ext) throw Error('Unable to get extension');

  return s3.createPresignedPost({
    Bucket: process.env.S3_BUCKET,
    Fields: {
      key,
    },
    Expires: expiration,
    Conditions: [
      ['content-length-range', 100, size], // 1MB
      ['starts-with', '$Content-Type', Mime[ext.toUpperCase()]],
    ],
  });
};
