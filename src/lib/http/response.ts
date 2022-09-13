import { APIGatewayProxyResult } from 'aws-lambda';
import HttpStatusCode from './code';

export default class Response {
    private data: string | number | Object | null | undefined;

    private readonly cacheDuration: number | undefined;

    private response: APIGatewayProxyResult = {
        body: '',
        statusCode: 0,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Type': 'application/json',
        },
    };

    constructor(code?: number, data?: string | number | Object, cacheDuration?: number) {
        this.response.statusCode = code ?? HttpStatusCode.NO_CONTENT;
        this.data = data;
        this.cacheDuration = cacheDuration;
    }

    with(data: string | number | Object): Response {
        this.data = data;

        return this;
    }

    code(code: number): Response {
        this.response.statusCode = code;

        return this;
    }

    header(key: string, value: boolean | number | string): Response {
        if (this.response.headers) {
            this.response.headers[key] = value;
        }

        return this;
    }

    /**
     * @param duration in seconds
     * @param isPrivate
     */
    cache(duration: number, isPrivate: boolean = false): Response {
        if (duration > 0 && this.response.headers) {
            this.response.headers['Cache-Control'] = `${!isPrivate ? 'public' : 'private'}, max-age=${duration}`;
            this.response.headers['Expires'] = new Date(Date.now() + duration).toUTCString();
        }

        return this;
    }

    build(): APIGatewayProxyResult {
        const content = this.data ? {data: this.data} : {};
        this.response.body = JSON.stringify(content);

        if (this.cacheDuration && this.cacheDuration > 0) this.cache(this.cacheDuration);

        return this.response;
    }
}
