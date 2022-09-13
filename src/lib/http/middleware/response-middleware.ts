import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, } from 'aws-lambda';
import { PromiseHandler } from './promise-handler';
import Response from '../response';
import HttpStatusCode from '../code';

// list of field values
// @ts-ignore circular type reference
export type JsonLikePrimitive = string | number | boolean | JsonLikePrimitive | null | undefined;
export type JsonLike = { [key: string]: JsonLikePrimitive } | JsonLike[];

export const responseHandler = () => (
    handler: PromiseHandler<APIGatewayProxyEvent, Response | APIGatewayProxyResult | JsonLike | undefined>
) => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const response = await handler(event, context);
    if (response === undefined) {
        return {
            statusCode: HttpStatusCode.NO_CONTENT,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            body: '',
        };
    }

    if (response instanceof Response) {
        return response.build();
    }

    // if the response is already of type APIGatewayProxyResult
    if ('body' in response && response.body && 'statusCode' in response && response.statusCode) {
        return response as APIGatewayProxyResult;
    }

    let content = response;
    // prevent double data property
    if ('data' in response && response.data) {
        content = response.data;
    }

    return {
        statusCode: HttpStatusCode.OK,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({data: content}),
    };
};