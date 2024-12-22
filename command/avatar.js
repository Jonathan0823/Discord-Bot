const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: "avatar",
    description: "Sends the user's avatar",
  },
  execute: async (message) => {
    const user = message.mentions.users.first() || message.author;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });
    
    const embed = new MessageEmbed()
    .setTitle(`${user.username}'s Avatar`)
    .setImage(avatar)
    .setColor('#00FF00');

    await message.channel.send({ embeds: [embed] });
  },
};