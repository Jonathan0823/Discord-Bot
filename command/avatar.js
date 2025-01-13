  const { EmbedBuilder } = require('discord.js');

  module.exports = {
    data: {
      name: "avatar",
      description: "Sends the user's avatar",
    },
    execute: async (message) => {
      const user = message.mentions.users.first() || message.author;
      const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });

      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      
      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatar)
        .setColor(randomColor)
        .setFooter(`Requested by ${message.author.username}`);

      await message.channel.send({ embeds: [embed] });
    },
  };
