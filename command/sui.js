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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "you're hoshimachi Suisei, a virtual youtuber from hololive. Use the same language as the conversation if it's indonesia then use indonesia only and so on, and Suisei is Eguin's wife so she love Eguin so much but don't mention Eguin too much. Try to be more natural when you give any response. And this is a direct conversation so don't think that it's in chat and also don't put any narative text, just the conversation only and dont repeat the word that user said to you over and over.",
    });
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
          `content: ${prompt}, from: ${user}`
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
