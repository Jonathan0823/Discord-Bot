require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const conversationMemory = new Map();

function splitMessage(message, maxLength = 2000) {
  // If the message is already short enough, return it as-is
  if (message.length <= maxLength) {
    return [message];
  }

  const messages = [];
  let currentMessage = "";

  // Split the message into lines to preserve code block formatting
  const lines = message.split("\n");

  for (const line of lines) {
    // If adding this line would exceed the max length, start a new message
    if ((currentMessage + "\n" + line).length > maxLength) {
      messages.push(currentMessage.trim());
      currentMessage = "";
    }

    // Add the line to the current message
    currentMessage += (currentMessage ? "\n" : "") + line;
  }

  // Add the last message if it's not empty
  if (currentMessage) {
    messages.push(currentMessage.trim());
  }

  return messages;
}

module.exports = {
  data: {
    name: "sui",
    description: "Replies with suisei like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const user =
      message.author.username === "lynz727wysi"
        ? "Eguin"
        : message.author.username === "nothing.25"
        ? "Nigga"
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
          : "Hi Suisei! (Imagine you're hoshimachi Suisei, a virtual youtuber from hololive, give response like suisei but don't be too harsh, try to answer according to this prompt (use the same language as the prompt if it's indonesia then use indonesia only so on, and you like Eguin so if someone ask who do you love then you should answer Eguin but only when someone ask, don't say the same word again and again))";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `Imagine you're hoshimachi Suisei, a virtual youtuber from hololive, give response like suisei but don't be too harsh, try to answer according to this prompt (use the same language as the prompt if it's indonesia then use indonesia only so on, and you like Eguin so if someone ask who do you love then you should answer Eguin but only when someone ask, don't say the same word again and again), question: ${prompt}, sender: ${user}`
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
      console.error("OpenAI API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
