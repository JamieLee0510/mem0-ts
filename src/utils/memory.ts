import { generateUpdateMemoryPrompt } from "../llms/prompt";

export const getUpdateMemoryMessages = (
    existMemories: string,
    memory: string,
) => {
    return [
        {
            role: "user",
            content: generateUpdateMemoryPrompt(existMemories, memory),
        },
    ];
};
