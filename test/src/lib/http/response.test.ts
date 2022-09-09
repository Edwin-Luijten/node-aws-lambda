import Response from '../../../../src/lib/http/response';
import HttpStatusCode from '../../../../src/lib/http/code';
import * as Joi from 'joi';

describe('Response Lib Test', () => {
    test('Response payload', () => {
        const expectation = {
            statusCode: HttpStatusCode.OK,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=500'
            },
            body: JSON.stringify({data: {foo: 'bar'}}),
        };

        const response = new Response();
        const payload = response.with({foo: 'bar'})
            .cache(500)
            .addHeader('Content-Type', 'application/json')
            .send();

        expect(payload).toStrictEqual(expectation);
    });

    test('Response validation error payload', () => {
        const {error} = Joi.object({
            email: Joi.string().email(),
        }).validate({
            email: 'foo'
        });

        if (!error) throw Error('Expected an error');

        const expectation = {
            statusCode: HttpStatusCode.BAD_REQUEST,
            headers: {},
            body: JSON.stringify({
                error: {
                    code: 'error.form.validation',
                    message: 'Not all fields are filled correctly.',
                    fields: [
                        {
                            field: 'email',
                            code: 'error.string.email',
                            message: '"email" must be a valid email'
                        }
                    ]
                }
            }),
        };

        const response = new Response();
        const payload = response.with(error)
            .send();

        expect(payload).toStrictEqual(expectation);
    });
});