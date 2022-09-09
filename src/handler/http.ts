/* eslint-disable */
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import Response from '../lib/http/response';

export const ping: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context) => (new Response('pong')).send();
