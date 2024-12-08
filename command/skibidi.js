module.exports = {
    data: {
      name: "skibidi",
      description: "Replies with Skibidi Sigma!",
    },
    execute: async (message) => {
      await message.channel.send("Skibidi Sigma");
    },
  };