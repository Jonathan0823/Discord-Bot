const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRandomColor } = require("../helper/randomColor");

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

const getEmoji = (game) => {
  switch (game) {
    case "gi":
      return "<:genshinimpact:1324355501466849331>";
    case "hsr":
      return "<:hsr:1324355673567395921>";
    case "zzz":
      return "<:zenless:1324356078825377932>";
    default:
      return "";
  }
};

const getCurrencyEmoji = (game) => {
  switch (game) {
    case "gi":
      return "<:primo:1334721457883971614>";
    case "hsr":
      return "<:jade:1334721376635846686>";
    case "zzz":
      return "<:poly:1334721545477820557>";
    default:
      return "";
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
    const messageFilter = (m) => m.author.id === interaction.user.id;

    await interaction.deferReply({ ephemeral: true });

    if (sender !== "lynz727wysi") {
      await interaction.editReply(
        "You are not authorized to use this command."
      );
      return;
    }

    try {
      await interaction.editReply(
        "Please choose a game (gi, hsr, zzz) or type 'c' to cancel."
      );
      const collectedGame = await currentChannel.awaitMessages({
        filter: messageFilter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      const selectedGame = collectedGame.first().content.toLowerCase();

      if (selectedGame === "c") {
        await interaction.editReply("Command cancelled.");
        collectedGame.first().delete();
        return;
      }

      if (!["gi", "hsr", "zzz"].includes(selectedGame)) {
        await interaction.editReply("Invalid game selected.");
        collectedGame.first().delete();
        return;
      }

      collectedGame.first().delete();

      await interaction.editReply(
        "Enter the codes (separate with ' ' for the items and ',' for other code) or type 'c' to cancel."
      );
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

      const codes = codeContent.split(",").map((entry) => {
        const parts = entry.trim().split(" ");
        const code = parts[0].toUpperCase();
        const value = parts[1] || "";
        return { code, value };
      });

      await collectedCode.first().delete();

      await interaction.editReply({
        content:
          "Please enter the channel ID where you want to send the message (use ' ' to add more channel ids). Type 'c' to cancel.",
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

      const maxCodeLength = Math.max(
        ...codes.map((entry) => entry.code.length)
      );

      const maxValueLength = Math.max(
        ...codes.map((entry) => entry.value.length)
      );

      // Code embed
      const color = getRandomColor();
      const embed = new EmbedBuilder()
        .setTitle(
          `${getEmoji(selectedGame)}   Redeem Code ${getGameName(
            selectedGame
          )}!`
        )
        .setColor(color)
        .setImage(
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamJxbmZlc296ZWN5cnFuaDdoY2Z5cXBpbm9hdnhieW00em01NHRqOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hQaCjkWd8y86EtipeI/giphy.gif"
        )
        .setDescription(
          `Halo ${
            selectedGame === "gi"
              ? "Traveler"
              : selectedGame === "hsr"
              ? "Trailblazer"
              : "Proxy"
          }, ada kode redeem baru nih! Yuk segera di redeem!

  **Redeem Codes:**
  ${codes
    .map(
      (entry) =>
        `\`${entry.code.padEnd(maxCodeLength)}\` ・ **\`${entry.value.padEnd(
          maxValueLength
        )}\`** ${getCurrencyEmoji(selectedGame)} → [Link](${
          link[selectedGame]
        }${entry.code})`
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

        await targetChannel.send({ embeds: [embed] });
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
