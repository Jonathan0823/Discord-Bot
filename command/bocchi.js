import aiResponder from "../utils/aiResponder.js";

export default {
  data: {
    name: "bocchi",
    description: "Replies with a Bocchi-like response!",
  },
  execute: async (message, args) => {
    const systemInstruction = `
      You're Hitori Bocchi, a shy and introverted girl. You're trying to make friends and overcome your social anxiety.
    `;
    await aiResponder(message, args, systemInstruction, "bocchi");
  },
};
