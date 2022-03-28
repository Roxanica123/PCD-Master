import { PubSub } from '@google-cloud/pubsub';
import { constructSettings } from 'google-gax';
import { Created, HttpActionResult, ServerError } from '../types';

export class EventHandler {
    private readonly pubSub = new PubSub();

    private constructor() { }

    public static readonly instance: EventHandler = new EventHandler();

    async publishMessage(topicId: string, data: any): Promise<string | undefined> {
        
        const dataBuffer = Buffer.from(data);
        
        try {
            return await this.pubSub.topic(topicId).publish(dataBuffer);
        } catch (error: any) {
            console.error(`Received error while publishing: ${error.message}`);
        }
    }
}