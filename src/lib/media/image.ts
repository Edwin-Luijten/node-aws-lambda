import { spawn } from 'child_process';

const orientations: { [key: string]: string } = {
    '1': 'TopLeft',
    '2': 'TopRight',
    '3': 'BottomRight',
    '4': 'BottomLeft',
    '5': 'LeftTop',
    '6': 'RightTop',
    '7': 'RightBottom',
    '8': 'LeftBottom',
    'Undefined': 'unknown',
};

export type ImageInfo = {
    size: number;
    width: number,
    height: number,
    format: string;
    extension: string;
}

const parse = (val: string): ImageInfo => {
    const info = JSON.parse(JSON.stringify(val.split('\n')));
    return {
        size: parseInt(info[0].split('=')[1].replace('B', '')),
        format: info[1].split('=')[1] ?? 'unknown',
        extension: info[2].split('=')[1],
        width: parseInt(info[3].split('=')[1]),
        height: parseInt(info[4].split('=')[1]),
    };
};

/**
 * imageProbe uses Imagick's identify command to retrieve image information
 * it throws an error when the image is not an image
 */
export function imageProbe(path: string, bin?: string): Promise<ImageInfo> {
    return new Promise<ImageInfo>((resolve, reject) => {
        let info: string = '';
        let stderr: string = '';

        const format = [
            'size=%B',
            'format=%m',
            'ext=%e',
            'height=%h',
            'width=%w',
        ].join('\n');

        const proc = spawn(process.env.IMAGICK_PATH ?? bin ?? 'magick', [
            'identify', '-verbose', '-format', format, path
        ]);

        proc.once('close', (code) => {
            if (!code) resolve(parse(info));
            else reject(stderr.split('\n').filter(Boolean).pop());
        });

        proc.stderr.on('data', (data: any) => {
            stderr += data.toString();
        })

        proc.stdout.on('data', (data) => {
            info += data.toString();
        });
    });
}
