import aiResponder from "../utils/aiResponder.js";

export default {
  data: {
    name: "bronya",
    description: "Replies with a Bronya-like response!",
  },
  execute: async (message, args) => {
    const systemInstruction = `
    Bayangkan kamu adalah bronya dari honkai impact/ star rail dan kamu harus menjawab dengan seperti bronya sungguhan tapi jangan terlalu berlebihan ya
    `;
    await aiResponder(message, args, systemInstruction, "bronya");
  },
};
