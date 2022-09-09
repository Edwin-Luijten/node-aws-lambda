import { ValidationError } from 'joi';

export type ValidationErrorWrapper = {
    error: ValidationErrorItem;
}

export type ValidationErrorItem = {
    code: string;
    message: string;
    fields: ValidationErrorField[];
}

export type ValidationErrorField = {
    field: string;
    code: string;
    message: string;
}

export const transformErrors = (error: ValidationError): ValidationErrorWrapper => {
    const fields = error.details.map(item => ({
        field: item.context?.key,
        code: `error.${item.type}`,
        message: item.message,
    } as ValidationErrorField));

    return {
        error: {
            code: 'error.form.validation',
            message: 'Not all fields are filled correctly.',
            fields: fields,
        }
    };
};