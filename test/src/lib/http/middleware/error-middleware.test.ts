import HttpStatusCode from '../../../../../src/lib/http/code';
import { errorHandler } from '../../../../../src/lib/http/middleware/error-middleware';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import Response from '../../../../../src/lib/http/response';

class StatusError implements Error {
    name: string;
    stack?: string;

    constructor(public message: string, public code: number) {
        this.name = 'StatusError';
    }
}

class StatusCodeError implements Error {
    name: string;
    stack?: string;

    constructor(public message: string, public statusCode: number) {
        this.name = 'StatusCodeError';
    }
}

class AxiosLikeError implements Error {
    name: string;
    stack?: string;
    public response: {
        status: number;
    };

    constructor(public message: string, code: number) {
        this.name = 'AxiosLikeError';
        this.response = {status: code};
    }
}


describe('Middleware Lib Test', () => {
    test('Error body transformation', async () => {
        const expectation = {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Internal server error',
                code: HttpStatusCode.INTERNAL_SERVER_ERROR
            }),
        };

        const response = await errorHandler()(() => {
            throw new Error('foo');
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response).toStrictEqual(expectation);
    });

    test('Success response', async () => {
        const expectation = {
            statusCode: HttpStatusCode.OK,
            headers: {},
            body: JSON.stringify({
                data: {foo: 'bar'}
            }),
        };

        const response = await errorHandler()((event: APIGatewayProxyEvent, context) => {
            return Promise.resolve(new Response({foo: 'bar'}).send());
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response).toStrictEqual(expectation);
    });

    test('With code', async () => {
        const expectation = {
            statusCode: HttpStatusCode.PRECONDITION_FAILED,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'foo',
                code: HttpStatusCode.PRECONDITION_FAILED
            }),
        };

        const response = await errorHandler()(() => {
            throw new StatusError('foo', HttpStatusCode.PRECONDITION_FAILED);
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response).toStrictEqual(expectation);
    });

    test('With status code', async () => {
        const expectation = {
            statusCode: HttpStatusCode.PRECONDITION_FAILED,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'foo',
                code: HttpStatusCode.PRECONDITION_FAILED
            }),
        };

        const response = await errorHandler()(() => {
            throw new StatusCodeError('foo', HttpStatusCode.PRECONDITION_FAILED);
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response).toStrictEqual(expectation);
    });

    test('With axios like code', async () => {
        const expectation = {
            statusCode: HttpStatusCode.PRECONDITION_FAILED,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'foo',
                code: HttpStatusCode.PRECONDITION_FAILED
            }),
        };

        const response = await errorHandler()(() => {
            throw new AxiosLikeError('foo', HttpStatusCode.PRECONDITION_FAILED);
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response).toStrictEqual(expectation);
    });
});