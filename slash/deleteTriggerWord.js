const { SlashCommandBuilder, MessageFlagsBitField } = require("discord.js");
const { prisma } = require("../lib/prisma");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletetriggerword")
    .setDescription("Delete a trigger word from the list")
    .addStringOption((option) =>
      option
        .setName("key")
        .setDescription("The word to delete")
        .setRequired(true)
    ),

  async execute(interaction) {
    const sender = interaction.user.username;

    if (sender !== "lynz727wysi") {
      await interaction.reply({
        content: "You are not authorized to use this command.",
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
      return;
    }

    const key = interaction.options.getString("key");

    try {
      await prisma.triggerWord.delete({
        where: {
          key,
        },
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "There was an error deleting the trigger word.",
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
    }
  },
};
