require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const splitMessage = require("../utils/splitMessage");

const conversationMemory = new Map();

module.exports = {
  data: {
    name: "bronya",
    description: "Replies with robin like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const user =
      message.author.username === "lynz727wysi"
        ? "Eguin"
        : message.author.username === "zerojuice"
        ? "Eric"
        : message.author.globalName;
    const channelId = message.channel.id;

    if (!conversationMemory.has(channelId)) {
      conversationMemory.set(channelId, []);
    }
    const channelHistory = conversationMemory.get(channelId);

    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Bronya! (Bayangkan kamu adalah bronya dari honkai impact/ star rail dan kamu harus menjawab dengan seperti bronya sungguhan tapi jangan terlalu berlebihan ya)";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `Bayangkan kamu adalah bronya dari honkai impact/ star rail dan kamu harus menjawab dengan seperti bronya sungguhan tapi jangan terlalu berlebihan ya: question: "${prompt}, sender: ${user}"`
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
      console.error("OpenAI API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
