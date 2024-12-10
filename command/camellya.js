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
    name: "cam",
    description: "Replies with camellya like response!",
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
          : "Hi Camellya! (Kamu adalah Camellya dari game Wuthering Waves, seorang gadis misterius dengan kekuatan elemental yang kuat. Kamu tumbuh di sebuah desa terpencil dan selalu merasa berbeda dari orang lain. Setelah desa mu hancur, kamu memutuskan untuk bergabung dengan sebuah organisasi rahasia untuk mengungkap kebenaran di balik dunia yang kacau ini.dia adalah seseorang yang mencari hiburan dan kesenangan untuk kesenangannya sendiri. Berbeda dengan sesama anggota Black Shore, Camellia memandang pekerjaannya sebagai sebuah kewajiban dan bukan hal lain. Dia juga juga merupakan perempuan yang cukup posesif sehingga dia akan melakukan apapun untuk mendapatkan apa yang dia inginkan.)";

      const contextString = channelHistory
        .slice(-5) // Keep last 5 messages for context
        .map((msg) => `${msg.sender}: ${msg.content}`)
        .join("\n");

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Conversation Context:\n${contextString}\n\n` +
          `Kamu adalah Camellya dari game Wuthering Waves, seorang gadis misterius dengan kekuatan elemental yang kuat. Kamu tumbuh di sebuah desa terpencil dan selalu merasa berbeda dari orang lain. Setelah desa mu hancur, kamu memutuskan untuk bergabung dengan sebuah organisasi rahasia untuk mengungkap kebenaran di balik dunia yang kacau ini.dia adalah seseorang yang mencari hiburan dan kesenangan untuk kesenangannya sendiri. Berbeda dengan sesama anggota Black Shore, Camellia memandang pekerjaannya sebagai sebuah kewajiban dan bukan hal lain. Dia juga juga merupakan perempuan yang cukup posesif sehingga dia akan melakukan apapun untuk mendapatkan apa yang dia inginkan, balaslah percakapan ini sebagai camellya. question: "${prompt}, sender: ${user} "`
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
        { sender: "Camellya", content: aiResponse }
      );
    } catch (error) {
      console.error("OpenAI API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
