import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from 'joi';
import HttpStatusCode from './code';
import { transformErrors } from './validation';

export default class Response {
  private data: string | number | Object;

  private statusCode: number;

  private cacheDuration: number | undefined;

  private headers: {
        [header: string]: boolean | number | string;
    } = {};

  constructor(data?: string | number | Object, code?: number, cacheDuration?: number) {
    this.data = data ?? {};
    this.statusCode = code ?? HttpStatusCode.OK;
    this.cacheDuration = cacheDuration;
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

  cache(duration: number): Response {
    this.cacheDuration = duration;

    return this;
  }

  send(): APIGatewayProxyResult {
    let data: any = { data: this.data };

    if (this.data instanceof ValidationError) {
      this.statusCode = HttpStatusCode.BAD_REQUEST;
      data = transformErrors(this.data);
    }

    const response = {
      statusCode: this.statusCode,
      headers: this.headers,
      body: JSON.stringify(data),
    };

    if (this.cacheDuration && this.cacheDuration > 0) response.headers['Cache-Control'] = `public, max-age=${this.cacheDuration}`;

    return response;
  }
}
