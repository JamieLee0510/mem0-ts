import { config } from "dotenv";
config();
export type MemoryConfig = {
    historyDbPath: string;
    llm: {
        provider: "openai";
        config: any;
    };
    collectionName: string;
    vectorStore: {
        provider: "qdrant";
        config: {
            host?: string;
            port?: number;
            url?: string;
            apiKey?: string;
        };
    };
    embedder: {
        provider: "openai" | "ollama" | "huggingface";
        config: any;
    };
};
export const defaultMemoryConfig: MemoryConfig = {
    historyDbPath: "",
    llm: {
        provider: "openai",
        config: {
            apiKey: process.env.OPENAI_API_KEY,
        },
    },
    collectionName: "demo_collection",
    vectorStore: {
        provider: "qdrant",
        config: {
            url: "http://127.0.0.1:6333",
        },
    },
    embedder: {
        provider: "openai",
        config: {
            apiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-small",
            dims: 1536,
        },
    },
};
