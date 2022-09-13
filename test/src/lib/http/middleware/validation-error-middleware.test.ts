import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { validationErrorHandler } from '../../../../../src/lib/http/middleware/validation-error-middleware';
import Response from '../../../../../src/lib/http/response';
import HttpStatusCode from '../../../../../src/lib/http/code';

describe('Middleware Lib Test', () => {
    describe('Validation Middleware', () => {
        test('Error transformation', async () => {
            const expectation = {
                statusCode: HttpStatusCode.BAD_REQUEST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error: {
                        code: 'error.form.validation',
                        message: 'Not all fields are filled correctly.',
                        fields: [
                            {
                                field: 'email',
                                code: 'error.string.email',
                                message: '"email" must be a valid email',
                            },
                        ],
                    },
                })
            };

            const response = await validationErrorHandler()(() => {
                const {error} = Joi.object({
                    email: Joi.string().email(),
                }).validate({
                    email: 'foo',
                });

                if (error) throw error;

                return Promise.resolve((new Response()).build());
            })({} as APIGatewayProxyEvent, {} as Context);

            expect(response).toStrictEqual(expectation);
        });

        test('Ignore non ValidationError', async () => {
            const response = validationErrorHandler()(() => {
                const {error} = Joi.object({
                    email: Joi.string().email(),
                }).validate({
                    email: 'foo',
                });

                if (error) throw new Error('Oops');

                return Promise.resolve((new Response()).build());
            })({} as APIGatewayProxyEvent, {} as Context);

            await expect(response).rejects.toThrow('Oops');
        });
    })

});