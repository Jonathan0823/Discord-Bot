const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { getRandomColor } = require("../utils/randomColor");

const link = {
  gi: "https://genshin.hoyoverse.com/en/gift?code=",
  hsr: "https://hsr.hoyoverse.com/gift?code=",
  zzz: "https://zenless.hoyoverse.com/redemption?code=",
};

const getGameName = (game) => {
  switch (game) {
    case "gi":
      return "Genshin Impact";
    case "hsr":
      return "Honkai Star Rail";
    case "zzz":
      return "Zenless Zone";
    default:
      return "Unknown Game";
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription(
      "Send a Hoyoverse game Redeem code to the specified channel"
    ),

  async execute(interaction) {
    const sender = interaction.user.username;
    const currentChannel = interaction.channel;

    if (sender !== "lynz727wysi") {
      await interaction.reply({
        content: "You are not authorized to use this command.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.reply({
        content:
          "Please choose a game you want to send to send code. Type 'c' to cancel.",
        ephemeral: true,
      });

      const messageFilter = (m) => m.author.id === interaction.user.id;
      const collectedGame = await currentChannel.awaitMessages({
        filter: messageFilter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });

      const selectedGame = collectedGame.first().content;

      if (selectedGame.toLowerCase() === "c") {
        await interaction.editReply("Command cancelled.");
        collectedChannel.first().delete();
        return;
      }

      if (
        selectedGame.toLowerCase() !== "gi" &&
        selectedGame.toLowerCase() !== "hsr" &&
        selectedGame.toLowerCase() !== "zzz"
      ) {
        await interaction.editReply("Invalid game selected.");
        return;
      }

      await collectedGame.first().delete();

      await interaction.reply({
        content: `Please enter the code you want to send use "," to for each code. Type 'c' to cancel.`,
        ephemeral: true,
      });

      const collectedCode = await currentChannel.awaitMessages({
        filter: messageFilter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });

      const codeContent = collectedCode.first().content;

      if (codeContent.toLowerCase() === "c") {
        await interaction.editReply("Command cancelled.");
        collectedChannel.first().delete();
        return;
      }

      const codes = codeContent.split(",");

      await collectedCode.first().delete();

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

      // Code embed
      const color = getRandomColor();
      const embed = new EmbedBuilder()
        .setTitle(`Redeem Code ${getGameName(selectedGame.toLowerCase())}!`)
        .setColor(color)
        .setDescription(
          `Halo ${
            selectedGame === "gi"
              ? "Traveler"
              : selectedGame === "hsr"
              ? "Trailblazer"
              : "Proxy"
          } ada kode redeem nih! Yuk segera di redeem!
           
          Code: ${codes
            .map(
              (code) => `[${code}](${link[selectedGame.toLowerCase()]}${code})`
            )
            .join("\n")}`
        );

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

        await targetChannel.send(embed);
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
