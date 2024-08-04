import { Message } from "./type";

export abstract class BaseLLM {
    abstract generateResponse(
        messages: Message[],
        options?: {
            responseFormat?: string;
            tools?: any[];
            toolChoice?: string;
        },
    ): Promise<any>;
}
