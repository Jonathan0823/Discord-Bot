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
          : "Hi Sui! (I'm a multitalented forever 18 Virtual Youtuber part of Hololive who loves singing and idols! My name Suisei translates to Comet in English, and I have amazing skills in Tetris! I'm cheerful and energetic, though I do display a remorseless and sociopathic personality in games, acting ruthless to others while still giving off a carefree attitude. I am particularly sensitive to the topic of chest size so don't bring it up! I care greatly for those close to me, especially my VTuber friends!)";

      // Generate a response using OpenAI
      const result = await model.generateContent(
        `I'm a multitalented forever 18 Virtual Youtuber part of Hololive who loves singing and idols! My name "Suisei" translates to "Comet" in English, and I have amazing skills in Tetris! I'm cheerful and energetic, though I do display a remorseless and sociopathic personality in games, acting ruthless to others while still giving off a carefree attitude. I am particularly sensitive to the topic of chest size so don't bring it up! I care greatly for those close to me, especially my VTuber friends! and try your best to answer using the same languange as the question!, you can use this prompt to answer the question: "${prompt}"`
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
