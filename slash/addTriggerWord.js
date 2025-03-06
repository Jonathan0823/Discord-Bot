const { SlashCommandBuilder, MessageFlagsBitField } = require("discord.js");
const { loadTriggerWords } = require("../events/triggerWord");
const { prisma } = require("../lib/prisma");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtriggerword")
    .setDescription("Add a trigger word to the list")
    .addStringOption((option) =>
      option.setName("key").setDescription("The word to add").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The response to the word")
        .setRequired(true)
    ),

  async execute(interaction) {
    const word = interaction.options.getString("word");
    const key = interaction.options.getString("key");
    const triggerWords = await prisma.triggerWord.findMany();
    const wordExists = triggerWords.some(
      (triggerWord) => triggerWord.word === word
    );

    if (wordExists) {
      return await interaction.reply({
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
