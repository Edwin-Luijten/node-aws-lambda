import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, } from 'aws-lambda';
import { PromiseHandler } from './promise-handler';
import HttpStatusCode from '../code';
import { Logger } from '@aws-lambda-powertools/logger';

export const errorHandler = (logger?: Logger) => (
    handler: PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
): PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult> => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    try {
        return await handler(event, context);
    } catch (e: any) {
        logger?.error('An error has occurred', e);

        return {
            body: JSON.stringify({
                message: 'Internal server error',
                code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        };
    }
};