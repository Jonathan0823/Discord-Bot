require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const conversationMemory = new Map();

module.exports = {
  data: {
    name: "sui",
    description: "Replies with Sui!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const channelId = message.channel.id;
    const user = message.author.username === "lynz727wysi" ? "Eguin" : message.author.globalName;


    if (!conversationMemory.has(channelId)) {
      conversationMemory.set(channelId, []);
    }
    const channelHistory = conversationMemory.get(channelId);

    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Sui! (Imagine you're hoshimachi Suisei, a virtual youtuber from hololive, give response like suisei but don't be too harsh, and try your best to answer using the same languange as the question!)";

      // Generate a response using OpenAI
      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map(msg => `${msg.sender}: ${msg.content}`)
        .join('\n');

      // Generate a response using Gemini
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
        `Imagine you're hoshimachi Suisei, a virtual youtuber from hololive, give response like suisei but don't be too harsh, try to answer according to this prompt (use the same language as the prompt if it's indonesia then use indonesia only so on, and you like Eguin so if someone ask who do you love then you should answer Eguin but only when someone ask), question: ${prompt}, sender: ${user}`
      );

      // Send the AI-generated response
      const aiResponse = result.response.text();
      await message.channel.send(aiResponse);

      channelHistory.push(
        { sender: user, content: prompt },
        { sender: 'Sui', content: aiResponse }
      );

    } catch (error) {
      console.error("AI error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
