const { SlashCommandBuilder } = require("discord.js");
const { hoyoContainer } = require("../utils/enka/hoyoContainer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("starrail")
    .setDescription("Star Rail related commands")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the account you want to view")
    ),

  async execute(interaction) {
    await hoyoContainer(
      interaction,
      "starrail",
      interaction.options.getString("id")
    );
  },
};
