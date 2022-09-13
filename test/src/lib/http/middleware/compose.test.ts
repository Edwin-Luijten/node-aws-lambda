import HttpStatusCode from '../../../../../src/lib/http/code';
import { errorHandler } from '../../../../../src/lib/http/middleware/error-middleware';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { validationErrorHandler } from '../../../../../src/lib/http/middleware/validation-error-middleware';
import * as Joi from 'joi';
import Response from '../../../../../src/lib/http/response';
import { compose, composeHandler } from '../../../../../src/lib/http/middleware/compose';

describe('Middleware Lib Test', () => {
    describe('Nesting Middlewares', () => {
        test('Error transformation', async () => {
            const mockErr = jest.spyOn(console, 'error').mockImplementation(() => {
            });
            const expectation = JSON.stringify({
                message: 'Internal server error',
                code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            });

            const response = await errorHandler()(
                validationErrorHandler()(() => {
                    throw new Error('foo');
                }))({} as APIGatewayProxyEvent, {} as Context);

            expect(response.body).toStrictEqual(expectation);
            mockErr.mockClear();
        });

        test('Validation error transformation', async () => {
            const expectation = JSON.stringify({
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
            });

            const response = await errorHandler()(
                validationErrorHandler()(() => {
                    const {error} = Joi.object({
                        email: Joi.string().email(),
                    }).validate({
                        email: 'foo',
                    });

                    if (error) throw error;

                    return Promise.resolve((new Response()).build());
                }))({} as APIGatewayProxyEvent, {} as Context);

            expect(response.body).toStrictEqual(expectation);
        });

        test('Nothing to transform', async () => {
            const expectation = JSON.stringify({});

            const response = await errorHandler()(
                validationErrorHandler()(() => {
                    const {error} = Joi.object({
                        email: Joi.string().email(),
                    }).validate({
                        email: 'foo@foo.com',
                    });

                    if (error) throw error;

                    return Promise.resolve((new Response()).build());
                }))({} as APIGatewayProxyEvent, {} as Context);

            expect(response.body).toStrictEqual(expectation);
        });
    });

    describe('Composing Middlewares', () => {
        test('throws a TypeError if called without any arguments', () => {
            expect(() => (compose as any)()).toThrow(
                new TypeError('compose requires at least one argument')
            );
        });

        test('calls the right-most function with the compose parameters', () => {
            const functions = [
                jest.fn().mockReturnValue(1),
                jest.fn().mockReturnValue(2),
                jest.fn().mockReturnValue(3),
            ];
            compose(functions[2], functions[1], functions[0])(0, 'second parameter');
            expect(functions[0]).toHaveBeenCalledWith(0, 'second parameter');
        });

        test.each([1, 2])(
            'calls the %ss function with the previous functions return value',
            async (n) => {
                const functions = [
                    jest.fn().mockReturnValue(1),
                    jest.fn().mockReturnValue(2),
                    jest.fn().mockReturnValue(3),
                ];
                compose(
                    functions[2],
                    functions[1],
                    functions[0]
                )(0, 'second parameter');
                expect(functions[n]).toHaveBeenCalledWith(n);
            }
        );

        test('returns the return value of the left-most function', async () => {
            const functions = [
                jest.fn().mockReturnValue(1),
                jest.fn().mockReturnValue(2),
                jest.fn().mockReturnValue(3),
            ];
            const returnValue = compose(
                functions[2],
                functions[1],
                functions[0]
            )(0, 'second parameter');
            expect(returnValue).toEqual(3);
        });

        test('Error transformation', async () => {
            const mockErr = jest.spyOn(console, 'error').mockImplementation(() => {
            });
            const expectation = JSON.stringify({
                message: 'Internal server error',
                code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            });

            const response = await composeHandler(
                errorHandler(),
                validationErrorHandler(),
                async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
                    throw new Error('foo');
                    // @ts-ignore
                    return;
                },
            )({} as APIGatewayProxyEvent, {} as Context);

            expect(response.body).toStrictEqual(expectation);
            mockErr.mockClear();
        });

        test('Validation error transformation', async () => {
            const expectation = JSON.stringify({
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
            });

            const response = await composeHandler(
                errorHandler(),
                validationErrorHandler(),
                (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
                    const {error} = Joi.object({
                        email: Joi.string().email(),
                    }).validate({
                        email: 'foo',
                    });

                    if (error) throw error;

                    return Promise.resolve((new Response()).build());
                },
            )({} as APIGatewayProxyEvent, {} as Context);

            expect(response.body).toStrictEqual(expectation);
        });

        test('Nothing to transform', async () => {
            const expectation = JSON.stringify({});

            const response = await composeHandler(
                errorHandler(),
                validationErrorHandler(),
                (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
                    const {error} = Joi.object({
                        email: Joi.string().email(),
                    }).validate({
                        email: 'foo@foo.com',
                    });

                    if (error) throw error;

                    return Promise.resolve((new Response()).build());
                },
            )({} as APIGatewayProxyEvent, {} as Context);

            expect(response.body).toStrictEqual(expectation);
        });
    });
});