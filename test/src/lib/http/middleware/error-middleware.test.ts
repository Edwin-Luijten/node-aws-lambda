import HttpStatusCode from '../../../../../src/lib/http/code';
import { errorHandler } from '../../../../../src/lib/http/middleware/error-middleware';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import Response from '../../../../../src/lib/http/response';

describe('Middleware Lib Test', () => {
    test('Error body transformation', async () => {
        const mockErr = jest.spyOn(console, 'error').mockImplementation(() => {
        });

        const expectation = JSON.stringify({
            message: 'Internal server error',
            code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        });

        const response = await errorHandler()(() => {
            throw new Error('foo');
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response.body).toStrictEqual(expectation);
        mockErr.mockClear();
    });

    test('Success response', async () => {
        const expectation = JSON.stringify({
            data: {foo: 'bar'}
        });

        const response = await errorHandler()((event: APIGatewayProxyEvent, context) => {
            return Promise.resolve(new Response(HttpStatusCode.OK, {foo: 'bar'}).build());
        })({} as APIGatewayProxyEvent, {} as Context);

        expect(response.body).toStrictEqual(expectation);
    });
});