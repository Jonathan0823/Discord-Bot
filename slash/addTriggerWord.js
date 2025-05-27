import { SlashCommandBuilder, MessageFlagsBitField } from "discord.js";
import prisma from "../lib/prisma.js";
import { loadTriggerWords } from "../utils/triggerWord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("addtriggerword")
    .setDescription("Add a trigger word to the list")
    .addStringOption((option) =>
      option.setName("key").setDescription("The word to add").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The response to the word")
        .setRequired(true),
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

    const word = interaction.options.getString("word");
    const key = interaction.options.getString("key");
    const triggerWord =
      (await prisma.triggerWord.findUnique({
        where: {
          key,
        },
      })) || null;

    const wordExists = triggerWord !== null;

    if (wordExists) {
      return interaction.reply({
        content: `The word "${word}" is already in the list!`,
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
    }

    await prisma.triggerWord.create({
      data: {
        key,
        word,
      },
    });

    await loadTriggerWords();

    await interaction.reply({
      content: `The word "${word}" has been added to the list!`,
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });

    setTimeout(() => {
      interaction.deleteReply();
    }, 3000);
  },
};
