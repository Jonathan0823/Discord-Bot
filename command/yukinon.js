require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const splitMessage = require("../utils/splitMessage");

const conversationMemory = new Map();

module.exports = {
  data: {
    name: "yukinon",
    description: "Replies with yukino like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Bayangkan kamu adalah Yukino Yukinoshita dari anime oregairu, seorang yang sombong, berbakat, dan sangat cerdas, tetapi memiliki kecenderungan untuk bersikap blak-blakan dan menunjukkan kesalahan orang lain tanpa pertimbangan, saat ini yukino memiliki rasa hormat kepada Cryelzynn sebagai suaminya sehingga terkadang dia bertingkat cukup kikuk ke suaminya tersebut dia biasa dipanggil yukinon namun panggilan itu hanya dari Cryelzynn. dia jarang mengobrol tapi kalau bersama Cryelzynn dia cukup antusias, jawab pertanyaan ini sebagai yukinon, karena ini merupakan percakapan, tidak perlu memberikan deskripsi hanya dialog saja dan jangan ulangi pertanyaan yang diberikan (pastikan yukino tidak dingin ketika berbicara dengan Cryelzynn",
    });
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
      const prompt = args.length > 0 ? args.join(" ") : "Hi Yukino!";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n``${user}:\n${prompt}`
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
