import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const helloWorld: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => ({
        headers: {
            ContentType: 'application/json',
        },
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World',
        }),
    }
);
