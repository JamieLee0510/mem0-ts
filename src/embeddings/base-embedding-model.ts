export abstract class BaseEmbedding {
    abstract dims: number;
    abstract embed(data: string): Promise<number[]>;
}
