export interface BaseLlmConfig {
    // Define your base configuration properties here
    [key: string]: any;
}

export class DefaultLlmConfig implements BaseLlmConfig {
    model: string;
    temperature: number;
    maxToken: number;
    topP: number;
    constructor() {
        this.model = "";
        this.temperature = 0;
        this.maxToken = 3000;
        this.topP = 1;
    }
}

export type Message = {
    role: string;
    content: string;
};

export abstract class LLMBase {
    protected config: BaseLlmConfig;

    constructor(config: BaseLlmConfig = new DefaultLlmConfig()) {
        this.config = config;
    }
    abstract generateResponse(messages: Message[]): string;
}
