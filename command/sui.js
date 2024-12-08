require('dotenv/config');
const OpenAI = require('openai');

module.exports = {
  data: {
    name: "sui",
    description: "Replies with Sui!",
  },
  execute: async (message, args) => {

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
      const prompt = args.length > 0 ? args.join(' ') : "Hi Sui! (sui is your name, ask what user wants to know)";



      // Generate a response using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: "You are a helpful and creative assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150 // Limit the response length
      });

      // Send the AI-generated response
      const aiResponse = completion.choices[0].message.content.trim();
      await message.channel.send(aiResponse);

    } catch (error) {
      console.error("OpenAI API error:", error);
      await message.channel.send("Sorry, something went wrong with the AI generation.");
    }

  },
};
