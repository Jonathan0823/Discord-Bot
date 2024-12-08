module.exports = {
    data: {
      name: "avatar",
      description: "Sends the user's avatar",
    },
    execute: async (message) => {
      const user = message.mentions.users.first() || message.author;
      const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });
      await message.channel.send(avatar);
    },
  };