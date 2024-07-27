import OpenAI from "openai";
import { config } from "dotenv";

config();

export class OpenAIEmbedding {
    client: OpenAI;
    model: string;
    dims: number;
    constructor(model: string = "text-embedding-3-small") {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.model = model;
        this.dims = 1536;
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
