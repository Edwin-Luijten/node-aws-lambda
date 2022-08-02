import { APIGatewayProxyResult } from 'aws-lambda';
import HttpStatusCode from './code';

export default class Response {
    private data: string | number | Object;
    private statusCode: number;
    private readonly cache: number | undefined;
    private headers: {
        [header: string]: boolean | number | string;
    } = {};

    constructor(data?: string | number | Object, code?: number, cache?: number) {
        this.data = data ?? {};
        this.statusCode = code ?? HttpStatusCode.OK;
        this.cache = cache;
    }

    with(data: string | number | Object): Response {
        this.data = data;

        return this;
    }

    code(code: number): Response {
        this.statusCode = code;

        return this;
    }

    addHeader(key: string, value: boolean | number | string): Response {
        this.headers[key] = value;

        return this;
    }

    send(): APIGatewayProxyResult {
        const response = {
            statusCode: this.statusCode,
            headers: this.headers,
            body: JSON.stringify({data: this.data}),
        };

        if (this.cache) response.headers['Cache-Control'] = `public, max-age=${this.cache}`;

        return response;
    }
}