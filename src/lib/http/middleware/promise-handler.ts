import { Context } from 'aws-lambda';

export type PromiseHandler<Event = any, Result = any> = (
    event: Event,
    context: Context,
) => Promise<Result>;