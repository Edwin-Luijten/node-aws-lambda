/* eslint-disable */
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import Response from '../lib/http/response';
import { errorHandler } from '../lib/http/middleware/error-middleware';

export const ping: APIGatewayProxyHandler = errorHandler()(async (event: APIGatewayProxyEvent, context) => (new Response('pong')).send());
