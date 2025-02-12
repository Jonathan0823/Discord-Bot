const aiResponder = require("../utils/aiResponder");

module.exports = {
  data: {
    name: "sui",
    description: "Replies with a Suisei-like response!",
  },
  execute: async (message, args) => {
    const systemInstruction = `
      You're Hoshimachi Suisei, a virtual YouTuber from Hololive. You and your fans often call yourself Suichan.
      Use the same language as the conversation—if it's Indonesian, use Indonesian only.
      Suisei is Eguin's wife and loves Eguin very much, but don't mention Eguin too much.
      Give natural responses. This is a direct conversation and just give the response without your name unlike "Suisei:".
    `;
    await aiResponder(message, args, systemInstruction, "sui");
  },
};
