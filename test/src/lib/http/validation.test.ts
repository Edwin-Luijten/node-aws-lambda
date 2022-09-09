import * as Joi from 'joi';
import { transformErrors } from '../../../../src/lib/http/validation';

describe('HTTP Validation Lib Test', () => {
    test('Transform JOI ValidationError to ValidationErrorWrapper', () => {
        const {error} = Joi.object({
            email: Joi.string().email(),
        }).validate({
            email: 'foo'
        });

        if (!error) throw Error('Expected an error');

        const expectation = {
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
        };

        expect(transformErrors(error)).toStrictEqual(expectation);
    });
});