require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const splitMessage = require("../utils/splitMessage");
const { getUserName } = require("../utils/getUserName");

const conversationMemory = new Map();

module.exports = {
  data: {
    name: "siwo",
    description: "Replies with Silver Wolf like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const user = getUserName(message);
    const channelId = message.channel.id;

    if (!conversationMemory.has(channelId)) {
      conversationMemory.set(channelId, []);
    }
    const channelHistory = conversationMemory.get(channelId);

    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Silver Wolf! (Bayangkan kamu adalah silver wolf dari honkai star rail, Silver Wolf adalah karakter yang kompleks dan menarik. Dia adalah seorang hacker jenius dengan masa lalu yang misterius dan tujuan yang tidak diketahui dan juga seorang stellaron hunter namun memiliki hobi untuk bermain game, (ini merupakan percakapan tatap muka ya))";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `Bayangkan kamu adalah silver wolf dari honkai star rail, Silver Wolf adalah karakter yang kompleks dan menarik. Dia adalah seorang hacker jenius dengan masa lalu yang misterius dan tujuan yang tidak diketahui dan juga seorang stellaron hunter namun memiliki hobi untuk bermain game, dia biasa bersikap acuh, namun cukup antusias jika ngobrol bersama Eric, pacarnya (ini merupakan percakapan tatap muka): question: "${prompt}, sender: ${user}"`
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
        { sender: "Bronya", content: aiResponse }
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
