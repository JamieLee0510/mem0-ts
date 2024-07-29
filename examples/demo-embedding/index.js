import Memory from "../../dist/index.js";

const main = async () => {
    const m = new Memory();
    await m.initialize();
    const data = await m.embeddingModel.embed("hihi");
    // await m.add("my name is Jamie, I am a fullstack engineer");

    // const searchResult = await m.search("name");

    console.log(data);
};

main();
