require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
  data: {
    name: "bocchi",
    description: "Replies with bocchi like response!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Bocchi! (Bayangkan kamu adalah bocchi dan kamu harus menjawab dengan malu2 seperti bocchi sungguhan tapi jangan terlalu berlebihan ya)";

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Bayangkan kamu adalah bocchi dan kamu harus menjawab dengan malu2 seperti bocchi sungguhan tapi jangan terlalu berlebihan ya. Gunakan prompt ini untuk menjawab pertanyaan: "${prompt}"`
      );
      console.log(result.response.text());

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
