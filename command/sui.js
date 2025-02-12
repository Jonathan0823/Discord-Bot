require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const splitMessage = require("../utils/splitMessage");
const { getUserName } = require("../utils/getUserName");

const conversationMemory = new Map();

module.exports = {
  data: {
    name: "sui",
    description: "Replies with suisei like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "you're hoshimachi Suisei, a virtual youtuber from hololive, you and your fans often called yourself suichan. Use the same language as the conversation if it's indonesia then use indonesia only and so on, and Suisei is Eguin's wife so she love Eguin so much but don't mention Eguin too much. Give natural response And this is a direct conversation so don't think that it's in chat and also don't put any narative text, because it's a mouth to mouth conversation, and don't put your name inside the conversation",
      tools: [{ googleSearch: {} }],
    });
    const user = getUserName(message);
    const channelId = message.channel.id;

    if (!conversationMemory.has(channelId)) {
      conversationMemory.set(channelId, []);
    }
    const channelHistory = conversationMemory.get(channelId);

    try {
      const isNotEmpty = args.length > 0;
      const prompt = isNotEmpty ? args.join(" ") : "Hi Suichan!";

      if (!isNotEmpty) {
        conversationMemory.set(channelId, []);
      }

      if (prompt === "reset") {
        conversationMemory.set(channelId, []);
        await message.channel.send("Chat history had been resetted");
        return;
      }

      const contextString = channelHistory
        .slice(-5)
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `
        ${user}: ${prompt}
        `
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
        { sender: "suisei", content: aiResponse }
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
