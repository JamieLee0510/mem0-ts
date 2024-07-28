import OpenAI from "openai";

export class OpenAIEmbedding {
    client: OpenAI;
    model: string;
    dims: number;
    constructor(config: { apiKey: string; model?: string; dims?: number }) {
        this.client = new OpenAI({ apiKey: config.apiKey });
        this.model = config.model || "text-embedding-3-small";
        this.dims = config.dims || 1536;
    }

    async embed(text: string) {
        const data = text.replace("\n", "");
        const response = await this.client.embeddings.create({
            model: this.model,
            input: data,
        });
        return response.data[0].embedding;
    }
}
