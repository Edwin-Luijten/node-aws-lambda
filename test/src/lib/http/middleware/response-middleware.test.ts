import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import Response from '../../../../../src/lib/http/response';
import HttpStatusCode from '../../../../../src/lib/http/code';
import { responseHandler } from '../../../../../src/lib/http/middleware/response-middleware';

describe('Middleware Lib Test', () => {
    describe('Response Middleware', () => {
        test('Transform Response object', async () => {
            const expectation = {
                statusCode: HttpStatusCode.NO_CONTENT,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: JSON.stringify({})
            };

            const response = await responseHandler()(() => {
                return Promise.resolve(new Response());
            })({} as APIGatewayProxyEvent, {} as Context);

            expect(response).toStrictEqual(expectation);
        });

        test('APIGatewayProxyResult', async () => {
            const expectation = {
                statusCode: HttpStatusCode.OK,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: JSON.stringify({foo: 'bar'})
            };

            const response = await responseHandler()(() => {
                return Promise.resolve(expectation);
            })({} as APIGatewayProxyEvent, {} as Context);

            expect(response).toStrictEqual(expectation);
        });

        test('Object to json', async () => {
            const expectation = {
                statusCode: HttpStatusCode.OK,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: JSON.stringify({data: {foo: 'bar'}}),
            };

            const response = await responseHandler()(() => {
                return Promise.resolve({
                    foo: 'bar',
                });
            })({} as APIGatewayProxyEvent, {} as Context);

            expect(response).toStrictEqual(expectation);
        });

        test('Prevent double data property', async () => {
            const expectation = {
                statusCode: HttpStatusCode.OK,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: JSON.stringify({data: {foo: 'bar'}}),
            };

            const response = await responseHandler()(() => {
                return Promise.resolve({
                    data: {foo: 'bar'},
                });
            })({} as APIGatewayProxyEvent, {} as Context);

            expect(response).toStrictEqual(expectation);
        });

        test('undefined', async () => {
            const expectation = {
                statusCode: HttpStatusCode.NO_CONTENT,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: '',
            };

            const response = await responseHandler()(() => {
                return Promise.resolve(undefined);
            })({} as APIGatewayProxyEvent, {} as Context);

            expect(response).toStrictEqual(expectation);
        });
    });
});