const { SlashCommandBuilder } = require("discord.js");
const { hoyoContainer } = require("../utils/hoyoContainer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("genshin")
    .setDescription("Genshin Impact related commands")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the account you want to view")
        .setRequired(true)
    ),
  async execute(interaction) {
    await hoyoContainer(
      interaction,
      "genshin",
      interaction.options.getString("id")
    );
  },
};
