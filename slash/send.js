const { SlashCommandBuilder, MessageFlagsBitField } = require("discord.js");
const { downloadImage } = require("../helper/downloadImage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send a message to a specified channel"),

  async execute(interaction) {
    const sender = interaction.user.username;
    const currentChannel = interaction.channel;

    if (sender !== "lynz727wysi") {
      await interaction.reply({
        content: "You are not authorized to use this command.",
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
      return;
    }

    try {
      await interaction.reply({
        content:
          "Please enter the message you want to send. Type 'c' to cancel.",
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });

      const messageFilter = (m) => m.author.id === interaction.user.id;
      const collectedMessage = await currentChannel.awaitMessages({
        filter: messageFilter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });

      const messageContent = collectedMessage.first().content;

      if (messageContent.toLowerCase() === "c") {
        await interaction.editReply("Command cancelled.");
        collectedMessage.first().delete();
        return;
      }

      const attachments = collectedMessage
        .first()
        .attachments.map((attachment) => attachment.url);

      const downloadedImages = await Promise.all(
        attachments.map(async (url) => {
          const imageBuffer = await downloadImage(url);
          return { attachment: imageBuffer, name: "image.png" };
        })
      );

      await collectedMessage.first().delete();

      await interaction.editReply({
        content:
          "Please enter the channel ID where you want to send the message. Type 'c' to cancel.",
      });

      const collectedChannel = await currentChannel.awaitMessages({
        filter: messageFilter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });

      const channelId = collectedChannel.first().content;

      if (channelId.toLowerCase() === "c") {
        await interaction.editReply("Command cancelled.");
        collectedChannel.first().delete;
        return;
      }

      await collectedChannel.first().delete();

      const ArrayChannelId = channelId.split(" ");

      ArrayChannelId.forEach(async (channelId) => {
        const targetChannel = await interaction.client.channels.fetch(
          channelId
        );
        if (!targetChannel || !targetChannel.isTextBased()) {
          await interaction.editReply(
            "Error: The provided channel ID is invalid."
          );
          return;
        }

        await targetChannel.send({
          content: messageContent,
          files: downloadedImages || undefined,
        });
      });

      await interaction.editReply("Message sent successfully!");
    } catch (error) {
      if (error.message === "time") {
        await interaction.editReply(
          "Time expired! Please try the command again."
        );
      } else if (error.name === "DiscordAPIError") {
        await interaction.editReply(
          "Error: Could not find or access the specified channel."
        );
      } else {
        console.error("Unexpected error:", error);
        await interaction.editReply("An unexpected error occurred.");
      }
    } finally {
      setTimeout(() => {
        interaction.deleteReply();
      }, 3000);
    }
  },
};
