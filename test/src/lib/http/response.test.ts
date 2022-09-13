import Response from '../../../../src/lib/http/response';
import HttpStatusCode from '../../../../src/lib/http/code';

describe('Response Lib Test', () => {
    test('Response payload', () => {
        const expectation = {
            statusCode: HttpStatusCode.OK,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'private, max-age=500',
                'Expires': new Date(Date.now() + 500).toUTCString(),
            },
            body: JSON.stringify({data: {foo: 'bar'}}),
        };

        const response = new Response();
        const payload = response.with({foo: 'bar'})
            .code(HttpStatusCode.OK)
            .cache(500, true)
            .header('Content-Type', 'application/json')
            .build();

        expect(payload).toStrictEqual(expectation);
    });

    test('Constructor', () => {
        const expectation = {
            statusCode: HttpStatusCode.OK,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=500',
                'Expires': new Date(Date.now() + 500).toUTCString(),
            },
            body: JSON.stringify({data: {foo: 'bar'}}),
        };

        const response = new Response(HttpStatusCode.OK, {foo: 'bar'}, 500);
        const payload = response
            .header('Content-Type', 'application/json')
            .build();

        expect(payload).toStrictEqual(expectation);
    });
});
