import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, } from 'aws-lambda';
import { PromiseHandler } from './promise-handler';
import HttpStatusCode from '../code';

export const errorHandler = () => (
    handler: PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
): PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult> => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    try {
        return await handler(event, context);
    } catch (e: any) {
        if (isStatusCodeError(e)) {
            return {
                body: JSON.stringify({
                    message: e.message,
                    code: e.statusCode ?? e.code ?? e.response.status,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: e.statusCode ?? e.code ?? e.response.status,
            };
        }

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

function isStatusCodeError(e: any): boolean {
    return (typeof e.statusCode === 'number' && e.statusCode !== HttpStatusCode.BAD_REQUEST && e.statusCode < HttpStatusCode.INTERNAL_SERVER_ERROR) ||
        (typeof e.response?.status === 'number' && e.response?.status !== HttpStatusCode.BAD_REQUEST && e.response?.status < HttpStatusCode.INTERNAL_SERVER_ERROR) ||
        (typeof e.code === 'number' && e.code !== HttpStatusCode.BAD_REQUEST && e.code < HttpStatusCode.INTERNAL_SERVER_ERROR);
}