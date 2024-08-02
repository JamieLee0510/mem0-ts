import { pipeline } from "@xenova/transformers";
import { BaseEmbedding } from "./base-embedding-model";

export class HuggingFaceEmbedding extends BaseEmbedding {
    private model: any;
    private modelPromise: Promise<any>;
    public dims!: number;

    constructor(modelName: string = "Xenova/all-MiniLM-L6-v2") {
        super();
        this.modelPromise = this.initializeModel(modelName);
    }

    private async initializeModel(modelName: string) {
        const model = await pipeline("feature-extraction", modelName);
        this.model = model;
        const result = await this.model("demo");
        this.dims = result[0].length;
        return model;
    }
    public async embed(text: string): Promise<number[]> {
        if (!this.model) {
            await this.modelPromise;
        }

        const result = await this.model(text);
        console.log(result);
        // 根据需要处理result，这里假设result是嵌入向量
        return Array.from(result["data"]);
    }
}
