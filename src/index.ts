import { v4 as uuidv4 } from "uuid";

import { OpenAIEmbedding } from "./embeddings/openai";
import OpenAILLM from "./llms/openai";
import { generateMemoryDeducationPrompt } from "./llms/prompt";
import { SQLiteManager } from "./storage/sqlite";
import { EmbeddingFactory, LLMFactory } from "./utils/factory";
import { QdrantClient } from "@qdrant/js-client-rest";
import { getUpdateMemoryMessages } from "./utils/memory";
import {
    ADD_MEMORY_TOOL,
    DELETE_MEMORY_TOOL,
    UPDATE_MEMORY_TOOL,
} from "./utils/tools";
import { generateCurrDate } from "./utils/helpter";
import { defaultMemoryConfig, MemoryConfig } from "./utils/config";

class Memory {
    config: MemoryConfig;
    llm!: OpenAILLM;
    embeddingModel!: OpenAIEmbedding; // TODO: base EmbedClass
    vectorStore: QdrantClient;
    collectionName: string;
    db: SQLiteManager;

    constructor(config: MemoryConfig = defaultMemoryConfig) {
        this.config = config;
        const vectorStoreConfig = this.config.vectorStore.config;
        this.vectorStore = new QdrantClient({
            host: vectorStoreConfig.host,
            port: vectorStoreConfig.port,
            apiKey: vectorStoreConfig.apiKey,
            url: vectorStoreConfig.url,
        });
        this.collectionName = this.config.collectionName;
        this.db = new SQLiteManager();
    }

    async initialize() {
        this.llm = await LLMFactory.create(
            this.config.llm.provider,
            this.config.llm.config,
        );
        this.embeddingModel = await EmbeddingFactory.create(
            this.config.embedder.provider,
            this.config.embedder.config,
        );
        const response = await this.vectorStore.getCollections();
        const collectionNames = response.collections.map(
            (collection) => collection.name,
        );

        if (!collectionNames.includes(this.collectionName)) {
            await this.vectorStore.createCollection(this.collectionName, {
                vectors: {
                    size: this.embeddingModel.dims,
                    distance: "Cosine",
                },
            });
        }
    }
    async add(
        data: string,
        userId?: string,
        agentId?: string,
        runId?: string,
        metadata: { [key: string]: any } = {},
        filters: { [key: string]: any } = {},
    ) {
        const embeddings = await this.embeddingModel.embed(data);
        if (userId) {
            metadata["user_id"] = userId;
            filters["user_id"] = userId;
        }
        if (agentId) {
            metadata["agent_id"] = agentId;
            filters["agent_id"] = agentId;
        }
        if (runId) {
            metadata["run_id"] = runId;
            filters["run_id"] = runId;
        }
        const prompt = generateMemoryDeducationPrompt(
            data,
            JSON.stringify(metadata),
        );
        const extractedMemories = await this.llm.generateResponse([
            {
                role: "system",
                content:
                    "You are an expert at deducing facts, preferences and memories from unstructured text.",
            },
            { role: "user", content: prompt },
        ]);
        const existingMemories = await this.vectorStore.search(
            this.collectionName,
            {
                vector: embeddings,
                limit: 5,
                filter: filters,
            },
        );
        // const existingMemoryItems = existingMemories.map((item) => ({
        //     id: item.id,
        //     score: item.score,
        //     text: item.payload!["data"],
        //     metadata: item.payload,
        // }));
        const serializedExistingMemories = existingMemories.map((item) => ({
            id: item.id,
            text: item.payload!["data"],
            score: item.score,
        }));

        const messages = getUpdateMemoryMessages(
            JSON.stringify(serializedExistingMemories),
            extractedMemories,
        );

        const tools = [ADD_MEMORY_TOOL, UPDATE_MEMORY_TOOL, DELETE_MEMORY_TOOL];
        const response = await this.llm.generateResponse(messages, {
            tools,
            toolChoice: "auto",
        });
        const toolCalls = response["tool_calls"];
        console.log("---toolcalls:", toolCalls);
        if (toolCalls) {
            const availableFuncs = {
                add_memory: this._createMemoryTool.bind(this),
                update_memory: this._updateMemoryTool.bind(this),
                delete_memory: this._deleteMemoryTool.bind(this),
            } as { [key: string]: (...args: any[]) => Promise<any> };
            for (const toolCall of toolCalls) {
                console.log(`toolCall: ${toolCall}`);
                const funcName = toolCall["name"];
                const funcToCall = availableFuncs[funcName];
                const funcParams = toolCall["arguments"];
                await funcToCall({ ...funcParams });
                console.log(`func ${funcToCall} execute successfully`);
            }
        }
    }
    async get() {}
    async getAll() {}
    async search() {}
    async update() {}
    async delete() {}
    async deleteAll() {}
    history() {}

    private async _createMemoryTool({ data }: { data: string }) {
        const embeddings = await this.embeddingModel.embed(data);
        const memoryId = uuidv4();
        const metadata = {
            data: data,
            created_at: generateCurrDate(),
        };
        await this.vectorStore.upsert(this.collectionName, {
            points: [
                {
                    id: memoryId,
                    vector: embeddings,
                    payload: metadata,
                },
            ],
        });
        this.db.addHistory(memoryId, "", data, "add");
    }
    private async _updateMemoryTool({
        memoryId,
        data,
    }: {
        memoryId: string;
        data: string;
    }) {
        const existingMemory = await this.vectorStore.retrieve(
            this.collectionName,
            {
                ids: [memoryId],
            },
        );
        const preValue = existingMemory[0].payload!["data"] as string;
        const newMetaData = {
            data: data,
            updated_at: generateCurrDate(),
        };
        const embeddings = await this.embeddingModel.embed(data);

        await this.vectorStore.upsert(this.collectionName, {
            points: [
                {
                    id: memoryId,
                    vector: embeddings,
                    payload: newMetaData,
                },
            ],
        });
        this.db.addHistory(memoryId, preValue, data, "update");
    }
    private async _deleteMemoryTool({ memoryId }: { memoryId: string }) {
        const existingMemory = await this.vectorStore.retrieve(
            this.collectionName,
            {
                ids: [memoryId],
            },
        );
        const preValue = existingMemory[0].payload!["data"] as string;
        await this.vectorStore.delete(this.collectionName, {
            points: [existingMemory[0].id],
        });
        this.db.addHistory(memoryId, preValue, "", "delete", 1);
    }

    async reset() {
        await this.vectorStore.deleteCollection(this.collectionName);
        this.db.reset();
    }

    chat() {
        throw new Error("Chat function not implemented yet.");
    }
}

export default Memory;
