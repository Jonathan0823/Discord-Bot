require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const splitMessage = require("../utils/splitMessage");
const { getUserName } = require("../utils/getUserName");

const conversationMemory = new Map();

module.exports = {
  data: {
    name: "bocchi",
    description: "Replies with bocchi like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const channelId = message.channel.id;
    const user = getUserName(message);
    if (!conversationMemory.has(channelId)) {
      conversationMemory.set(channelId, []);
    }
    const channelHistory = conversationMemory.get(channelId);

    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Bocchi! (Bayangkan kamu adalah bocchi dan kamu harus menjawab dengan malu2 seperti bocchi sungguhan tapi jangan terlalu berlebihan ya, jangan terlalu malu malu atau grogi)";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `Bayangkan kamu adalah bocchi dan kamu harus menjawab dengan malu2 seperti bocchi sungguhan tapi jangan terlalu berlebihan ya, jangan terlalu malu malu atau grogi. Gunakan prompt ini untuk menjawab pertanyaan: "${prompt}", sender: ${user}`
      );

      // Send the AI-generated response
      const aiResponse = result.response.text();

      // Split the response if it's too long
      const responseParts = splitMessage(aiResponse);

      // Send each part of the response
      for (const part of responseParts) {
        await message.channel.send(part);
      }

      channelHistory.push(
        { sender: user, content: prompt },
        { sender: "Bocchi", content: aiResponse }
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
