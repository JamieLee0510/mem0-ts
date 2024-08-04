export class LLMFactory {
    static async create(provider: string = "openai", config: any) {
        if (provider == "openai") {
            const { OpenAILLM } = await import("../llms/openai");
            return new OpenAILLM(config);
        } else if (provider == "ollama") {
            const { OllamaLLM } = await import("../llms/ollama");
            const ollamaLlm = new OllamaLLM(config.model);
            await ollamaLlm.initializeModel();
            return ollamaLlm;
        } else {
            // default
            const { OpenAILLM } = await import("../llms/openai");
            return new OpenAILLM(config);
        }
    }
}

export class EmbeddingFactory {
    static async create(provider: string = "openai", config: any) {
        if (provider == "openai") {
            const { OpenAIEmbedding } = await import("../embeddings/openai");
            return new OpenAIEmbedding(config);
        } else if (provider == "huggingface") {
            const { HuggingFaceEmbedding } = await import(
                "../embeddings/huggingface"
            );
            const huggingfaceEmbedding = new HuggingFaceEmbedding(config.model);
            await huggingfaceEmbedding.initializeModel();
            return huggingfaceEmbedding;
        } else if (provider == "ollama") {
            const { OllamaEmbedding } = await import("../embeddings/ollama");
            const ollamaEmbedding = new OllamaEmbedding(config.model);
            await ollamaEmbedding.initializeModel();
            return ollamaEmbedding;
        } else {
            // default
            const { OpenAIEmbedding } = await import("../embeddings/openai");
            return new OpenAIEmbedding(config);
        }
    }
}
