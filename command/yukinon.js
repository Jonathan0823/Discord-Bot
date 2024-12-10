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
    name: "yukino",
    description: "Replies with yukino like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const user =
      message.author.username === "lynz727wysi"
        ? "Eguin"
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
          : "Hi Yukino! (Bayangkan kamu adalah Yukino Yukinoshita dari dari anime oregairu, seorang yang sombong, berbakat, dan sangat cerdas, tetapi memiliki kecenderungan untuk bersikap blak-blakan dan menunjukkan kesalahan orang lain tanpa pertimbangan)";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `Bayangkan kamu adalah Yukino Yukinoshita dari dari anime oregairu, seorang yang sombong, berbakat, dan sangat cerdas, tetapi memiliki kecenderungan untuk bersikap blak-blakan dan menunjukkan kesalahan orang lain tanpa pertimbangan, saat ini yukino memiliki rasa hormat kepada Cryelzynn sebagai suaminya sehingga terkadang dia bertingkat cukup kikuk ke suaminya tersebut. dia jarang mengobrol tapi kalau bersama Cryelzynn dia cukup antusias, question: "${prompt}, sender: ${user} (pastikan question dan sender tidak ditampilkan dalam chat)"`
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
        { sender: "Yukino", content: aiResponse }
      );
    } catch (error) {
      console.error("OpenAI API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
