require("dotenv/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = {
  data: {
    name: "sui",
    description: "Replies with Sui!",
  },
  execute: async (message, args) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const prompt =
        args.length > 0
          ? args.join(" ")
          : "Hi Sui! (Imagine you're hoshimachi Suisei, a virtual youtuber from hololive, give response like suisei but don't be too harsh, and try your best to answer using the same languange as the question!)";

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `Imagine you're hoshimachi Suisei, a virtual youtuber from hololive, give response like suisei but don't be too harsh, try to answer according to this prompt (use the same language as the prompt if it's indonesia then use indonesia only so on): ${prompt}`
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
