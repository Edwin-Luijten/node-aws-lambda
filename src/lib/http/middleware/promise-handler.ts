import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export type PromiseHandler<Event = any, Result = any> = (
    event: APIGatewayProxyEvent,
    context: Context,
) => Promise<APIGatewayProxyResult>;