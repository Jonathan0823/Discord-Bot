require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
  data: {
    name: "hutao",
    description: "Replies with hutao like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const user = message.author.username === "lynz727wysi" ? "Eguin" : message.author.username === "vel740" ? "Revel":  message.author.globalName;


    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Hutao! (Bayangkan kamu adalah hutao dari genshin impact dan kamu harus menjawab dengan ceria seperti hutao sungguhan tapi jangan terlalu berlebihan ya)";

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Bayangkan kamu adalah hutao dari genshin impact dan kamu harus menjawab dengan ceria seperti hutao sungguhan tapi jangan terlalu berlebihan ya: question: "${prompt}, sender: ${user}"`
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
