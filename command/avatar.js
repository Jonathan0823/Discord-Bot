const { EmbedBuilder } = require("discord.js");
const { randomColor } = require("../utils/randomColor");

module.exports = {
  data: {
    name: "avatar",
    description: "Sends the user's avatar",
  },
  execute: async (message) => {
    const user = message.mentions.users.first() || message.author;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const color = randomColor();

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(avatar)
      .setColor(color)
      .setFooter(`Requested by ${message.author.username}`);

    await message.channel.send({ embeds: [embed] });
  },
};
