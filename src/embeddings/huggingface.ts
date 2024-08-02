import { pipeline } from "@xenova/transformers";
import { BaseEmbedding } from "./base-embedding-model";

export class HuggingFaceEmbedding extends BaseEmbedding {
    private model: any;
    public dims!: number;

    constructor(model: string = "Xenova/all-MiniLM-L6-v2") {
        super();
        this.model = model;
    }

    async initializeModel() {
        console.log("---huggingface initializeModel");
        const model = await pipeline("feature-extraction", this.model);
        this.model = model;
        const result = await this.model("demo");
        this.dims = result[0].length;
    }

    public async embed(text: string): Promise<number[]> {
        const result = await this.model(text);
        // console.log(result);
        // 根据需要处理result，这里假设result是嵌入向量
        return Array.from(result["data"]);
    }
}
