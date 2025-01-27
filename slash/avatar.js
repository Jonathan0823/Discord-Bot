const { EmbedBuilder } = require("discord.js");
const { getRandomColor } = require("../utils/randomColor");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get the avatar of a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get the avatar from")
        .setRequired(false)
    ),

  execute: async (interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const color = getRandomColor();

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(avatar)
      .setColor(color)
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.channel.send({ embeds: [embed] });

    await interaction.deferReply({ ephemeral: true });
    await interaction.deleteReply();
  },
};
