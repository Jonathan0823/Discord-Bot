require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const splitMessage = require("./splitMessage");
const { getUserName } = require("./getUserName");

const conversationMemory = new Map();

async function aiResponder(message, args, systemInstruction, commandName) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
    tools: [{ googleSearch: {} }],
  });

  const user = getUserName(message);
  const channelId = message.channel.id;

  // Use a combination of channelId and commandName for namespacing
  const memoryKey = `${channelId}-${commandName}`;

  if (!conversationMemory.has(memoryKey)) {
    conversationMemory.set(memoryKey, []);
  }
  const channelHistory = conversationMemory.get(memoryKey);

  try {
    const isNotEmpty = args.length > 0;
    const prompt = isNotEmpty ? args.join(" ") : "Hi there!";

    if (!isNotEmpty) {
      conversationMemory.set(memoryKey, []);
    }

    if (prompt.toLowerCase() === "reset") {
      conversationMemory.set(memoryKey, []);
      await message.channel.send("Chat history has been reset.");
      return;
    }

    const contextString = channelHistory
      .slice(-5)
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    const result = await model.generateContent(
      `Conversation Context:\n${contextString}\n\n${user}: ${prompt}`
    );

    const aiResponse = result.response.text();

    const responseParts = splitMessage(aiResponse);

    for (const part of responseParts) {
      await message.channel.send(part);
    }

    channelHistory.push(
      { sender: user, content: prompt },
      { sender: commandName, content: aiResponse }
    );
  } catch (error) {
    console.error("Gemini API error:", error);
    await message.channel.send("Sorry, something went wrong with the AI generation.");
  }
}

module.exports = aiResponder;
