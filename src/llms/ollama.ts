import nodeOllama, { ChatRequest, Ollama } from "ollama";
import { BaseLLM } from "./base-llm";
import { Message } from "./type";
// import browserOllama from "ollama/browser";

export class OllamaLLM extends BaseLLM {
    ollama: Ollama;
    model: string;
    constructor(model: string = "llama3.1") {
        super();
        this.ollama = nodeOllama; // TODO: browser ollama
        this.model = model;
    }

    async initializeModel() {
        const modelList = await this.ollama.list();
        let hasModel = false;
        modelList.models.forEach((model) => {
            if (model.name == this.model) {
                hasModel = true;
            }
        });
        if (!hasModel) {
            await this.ollama.pull({ model: this.model });
        }
    }

    _parseResponse(response: any, tools?: any[]) {
        if (tools) {
            const processedResponse = {
                content: response["message"]["content"],
                tool_calls: [] as { [key: string]: any }[],
            };
            if (response["message"].tool_calls) {
                for (const toolCall of response["message"]["tool_calls"]) {
                    console.log(
                        "--toolCall.function.arguments:",
                        toolCall.function.arguments,
                    );
                    processedResponse.tool_calls.push({
                        name: toolCall.function.name,
                        arguments: JSON.parse(toolCall.function.arguments.data),
                    });
                }
            }
            return processedResponse;
        }
        return response["message"]["content"];
    }

    async generateResponse(
        messages: Message[],
        options?: {
            responseFormat?: string;
            tools?: any[];
        },
    ) {
        const params = {
            model: this.model,
            messages: messages,
        } as ChatRequest & { stream: true };

        if (options) {
            if (options.responseFormat) {
                params.format = options.responseFormat;
            }
            if (options.tools) {
                params.tools = options.tools;
            }
        }
        const res = await this.ollama.chat(params);
        return this._parseResponse(res, params.tools);
    }
}

export default OllamaLLM;
