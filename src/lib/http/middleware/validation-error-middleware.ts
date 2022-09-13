import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, } from 'aws-lambda';
import { PromiseHandler } from './promise-handler';
import HttpStatusCode from '../code';
import { ValidationError } from 'joi';
import { transformErrors } from '../validation';

export const validationErrorHandler = () => (
    handler: PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
): PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult> => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    try {
        return await handler(event, context);
    } catch (e: any) {
        if (e instanceof ValidationError) {
            return {
                body: JSON.stringify(transformErrors(e)),
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: HttpStatusCode.BAD_REQUEST
            };
        }

        throw e;
    }
};
