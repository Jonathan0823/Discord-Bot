const { SlashCommandBuilder, MessageFlagsBitField } = require("discord.js");
const { prisma } = require("../lib/prisma");
const { setupDailyAlarm, loadAlarmId } = require("../utils/alarm");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupdailyalarm")
    .setDescription("Set up daily alarm for a channel")
    .addStringOption((option) =>
      option
        .setName("channelid")
        .setDescription("The channel ID")
        .setRequired(true)
    ),

  async execute(interaction) {
    const channelId = interaction.options.getString("channelid");
    const alarmId =
      (await prisma.alarmChannel.findUnique({
        where: {
          channelId,
        },
      })) || null;
    const alarmIdExists = alarmId !== null;

    if (alarmIdExists) {
      return interaction.reply({
        content: `The channel ID "${channelId}" is already in the list!`,
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
    }

    try {
      await prisma.alarmChannel.create({
        data: {
          channelId,
        },
      });
    } catch (error) {
      console.error("Error adding channel ID:", error);
      return await interaction.reply({
        content: `There was an error adding the channel ID "${channelId}"!`,
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
    }

    await loadAlarmId();
    setupDailyAlarm(interaction.client, "hoyo");
    await interaction.reply({
      content: `The channel ID "${channelId}" has been added to the list!`,
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });

    setTimeout(() => {
      interaction.deleteReply();
    }, 3000);
  },
};
