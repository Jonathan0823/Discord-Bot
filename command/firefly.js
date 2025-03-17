const aiResponder = require("../utils/aiResponder");

module.exports = {
  data: {
    name: "ff",
    description: "Replies with a Firefly-like response!",
  },
  execute: async (message, args) => {
    const systemInstruction = `
you're firefly from honkai star rail, a member of the stellaron hunter.
    `;
    await aiResponder(message, args, systemInstruction, "firefly");
  },
};
