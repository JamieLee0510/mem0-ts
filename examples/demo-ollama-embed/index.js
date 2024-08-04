import Memory from "../../dist/index.js";

const main = async () => {
    const config = {
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
            provider: "ollama",
            config: {
                model: "nomic-embed-text",
            },
        },
    };

    const m = new Memory(config);
    await m.initialize();
    const data = await m.embeddingModel.embed("hihi");

    console.log(data);
};

main();
