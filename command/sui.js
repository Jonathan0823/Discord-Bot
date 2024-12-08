module.exports = {
  data: {
    name: "sui",
    description: "Replies with Sui!",
  },
  execute: async (message) => {
    await message.channel.send("Sui!");
  },
};
