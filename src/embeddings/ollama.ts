import nodeOllama, { Ollama } from "ollama";
// import browserOllama from "ollama/browser";
import { BaseEmbedding } from "./base-embedding-model";

export class OllamaEmbedding extends BaseEmbedding {
    model: string;
    dims!: number;
    ollama: Ollama;
    constructor(model: string = "nomic-embed-text") {
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
        const firstEmbedding = await this.ollama.embed({
            model: this.model,
            input: "firstEmbedding",
        });

        this.dims = firstEmbedding.embeddings[0].length;
    }

    async embed(text: string) {
        const data = await this.ollama.embed({
            model: this.model,
            input: text,
        });
        return data.embeddings[0];
    }
}

export default OllamaEmbedding;
