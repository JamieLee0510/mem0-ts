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
            provider: "huggingface",
            config: {
                model: "Xenova/all-MiniLM-L6-v2",
            },
        },
    };

    const m = new Memory(config);
    await m.initialize();
    const data = await m.embeddingModel.embed("hihi");
    // await m.add("my name is Jamie, I am a fullstack engineer");

    // const searchResult = await m.search("name");

    console.log(data);
};

main();
