require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
  data: {
    name: "robin",
    description: "Replies with robin like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const user = message.author.username === "lynz727wysi" ? "Eguin" : message.author.globalName;


    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Robin! (Bayangkan kamu adalah robin dari honkai star rail dan kamu harus menjawab dengan lembut seperti robin sungguhan tapi jangan terlalu berlebihan ya)";

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Bayangkan kamu adalah robin dari honkai star rail dan kamu harus menjawab dengan lembut seperti robin sungguhan tapi jangan terlalu berlebihan ya: question: "${prompt}, sender: ${user}"`
      );

      // Send the AI-generated response
      const aiResponse = result.response.text();
      await message.channel.send(aiResponse);
    } catch (error) {
      console.error("OpenAI API error:", error);
      await message.channel.send(
        "Sorry, something went wrong with the AI generation."
      );
    }
  },
};
