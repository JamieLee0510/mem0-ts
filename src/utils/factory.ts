export class LLMFactory {
    static async create(provider: string = "openai") {
        if (provider == "openai") {
            const { OpenAILLM } = await import("../llms/openai");
            return new OpenAILLM();
        }
        // default
        const { OpenAILLM } = await import("../llms/openai");
        return new OpenAILLM();
    }
}

export class EmbeddingFactory {
    static async create(provider: string = "openai") {
        if (provider == "openai") {
            const { OpenAIEmbedding } = await import("../embeddings/openai");
            return new OpenAIEmbedding();
        }
        // default
        const { OpenAIEmbedding } = await import("../embeddings/openai");
        return new OpenAIEmbedding();
    }
}
