export class LLMFactory {
    static async create(provider: string = "openai", config: any) {
        if (provider == "openai") {
            const { OpenAILLM } = await import("../llms/openai");
            return new OpenAILLM(config);
        }
        // default
        const { OpenAILLM } = await import("../llms/openai");
        return new OpenAILLM(config);
    }
}

export class EmbeddingFactory {
    static async create(provider: string = "openai", config: any) {
        if (provider == "openai") {
            const { OpenAIEmbedding } = await import("../embeddings/openai");
            return new OpenAIEmbedding(config);
        }
        // default
        const { OpenAIEmbedding } = await import("../embeddings/openai");
        return new OpenAIEmbedding(config);
    }
}
