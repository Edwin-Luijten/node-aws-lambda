/* eslint-disable */
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import Response from '../lib/http/response';
import { errorHandler } from '../lib/http/middleware/error-middleware';
import { composeHandler } from '../lib/http/middleware/compose';
import { responseHandler } from '../lib/http/middleware/response-middleware';
import HttpStatusCode from '../lib/http/code';

export const ping: APIGatewayProxyHandler = composeHandler(
    errorHandler(),
    responseHandler(),
    async (event: APIGatewayProxyEvent, context) => (new Response(HttpStatusCode.OK, 'pong')),
);
