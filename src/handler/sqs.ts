import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handleQueue: SQSHandler = async (event: SQSEvent) => {
    const records = event.Records;
    if (records.length === 0) return;

    for (let i = 0; i < records.length; i += 1) {

    }
};