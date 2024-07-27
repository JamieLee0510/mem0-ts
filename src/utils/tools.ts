export const ADD_MEMORY_TOOL = {
    type: "function",
    function: {
        name: "add_memory",
        description: "Add a memory",
        parameters: {
            type: "object",
            properties: {
                data: { type: "string", description: "Data to add to memory" },
            },
            required: ["data"],
        },
    },
};

export const UPDATE_MEMORY_TOOL = {
    type: "function",
    function: {
        name: "update_memory",
        description: "Update memory provided ID and data",
        parameters: {
            type: "object",
            properties: {
                memoryId: {
                    type: "string",
                    description: "memoryId of the memory to update",
                },
                data: {
                    type: "string",
                    description: "Updated data for the memory",
                },
            },
            required: ["memoryId", "data"],
        },
    },
};

export const DELETE_MEMORY_TOOL = {
    type: "function",
    function: {
        name: "delete_memory",
        description: "Delete memory by memory_id",
        parameters: {
            type: "object",
            properties: {
                memoryId: {
                    type: "string",
                    description: "memoryId of the memory to delete",
                },
            },
            required: ["memoryId"],
        },
    },
};
