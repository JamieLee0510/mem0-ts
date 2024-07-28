import OpenAI from "openai";
import { Message } from "./type";
import {
    ChatCompletionCreateParamsStreaming,
    ChatCompletionMessageParam,
} from "openai/resources";

export class OpenAILLM {
    client: OpenAI;
    constructor(config: { apiKey: string }) {
        this.client = new OpenAI(config);
    }

    _parseResponse(response: any, tools?: any[]) {
        if (tools) {
            const processedResponse = {
                content: response.choices[0].message.content,
                tool_calls: [] as { [key: string]: any }[],
            };
            if (response.choices[0].message.tool_calls) {
                for (const toolCall of response.choices[0].message.tool_calls) {
                    console.log("---_parseResponse func, toolCall:", toolCall);
                    processedResponse.tool_calls.push({
                        name: toolCall.function.name,
                        arguments: JSON.parse(toolCall.function.arguments),
                    });
                }
            }
            return processedResponse;
        }
        return response.choices[0].message.content;
    }
    // responseFormat: string,tools: any[],toolChoice = "auto"
    async generateResponse(
        messages: Message[],
        options?: {
            responseFormat?: string;
            tools?: any[];
            toolChoice?: string;
        },
    ) {
        const params: { [key: string]: any } = {
            messages: messages as ChatCompletionMessageParam[],
            model: "gpt-4o",
            temperature: 1,
            top_p: 1,
            max_tokens: 3000,
        };
        if (options?.responseFormat) {
            params["response_format"] = options.responseFormat;
        }
        if (options?.tools) {
            params["tools"] = options.tools;
        }
        if (options?.toolChoice) {
            params["tool_choice"] = options.toolChoice;
        }
        const response = await this.client.chat.completions.create(
            params as ChatCompletionCreateParamsStreaming,
        );
        return this._parseResponse(response, params.tools);
    }
}

export default OpenAILLM;
