require("dotenv/config");
const { EmbedBuilder } = require("discord.js");
const { getRandomColor } = require("../helper/randomColor");

const AUTHORIZED_USER = "lynz727wysi";

const CHANNEL_CONFIG = {
  "1337568739415167057": { game: "gi", name: "Genshin Impact" },
  "1337568755462701177": { game: "hsr", name: "Honkai Star Rail" },
  "1337568767395364938": { game: "zzz", name: "Zenless Zone Zero" },
};

const OUTPUT_CHANNEL_GI = process.env.REDEEM_CHANNEL_GI.split(",");
const OUTPUT_CHANNEL_HSR = process.env.REDEEM_CHANNEL_HSR.split(",");
const OUTPUT_CHANNEL_ZZZ = process.env.REDEEM_CHANNEL_ZZZ.split(",");

const link = {
  gi: "https://genshin.hoyoverse.com/en/gift?code=",
  hsr: "https://hsr.hoyoverse.com/gift?code=",
  zzz: "https://zenless.hoyoverse.com/redemption?code=",
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

const parseMessage = (content) => {
  // Expected format: code1 item1,code2 item2
  const codes = content.split(",").map((entry) => {
    const [code, ...valueParts] = entry.trim().split(" ");
    const value = valueParts.join(" ") || "";
    return { code: code.toUpperCase(), value };
  });

  return codes;
};

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // Check if message is in one of the monitored channels
    const channelConfig = CHANNEL_CONFIG[message.channelId];
    if (!channelConfig) return;

    // Check if sender is authorized
    if (message.author.username !== AUTHORIZED_USER) {
      await message.reply("You are not authorized to use this channel.");
      await message.delete();
      return;
    }

    try {
      const codes = parseMessage(message.content);
      const gameType = channelConfig.game;

      const maxCodeLength = Math.max(
        ...codes.map((entry) => entry.code.length)
      );
      const maxValueLength = Math.max(
        ...codes.map((entry) => entry.value.length)
      );

      // Create embed
      const color = getRandomColor();
      const embed = new EmbedBuilder()
        .setTitle(`${getEmoji(gameType)}   Redeem Code ${channelConfig.name}!`)
        .setColor(color)
        .setImage(
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamJxbmZlc296ZWN5cnFuaDdoY2Z5cXBpbm9hdnhieW00em01NHRqOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hQaCjkWd8y86EtipeI/giphy.gif"
        )
        .setDescription(
          `Halo ${
            gameType === "gi"
              ? "Traveler"
              : gameType === "hsr"
              ? "Trailblazer"
              : "Proxy"
          }, ada kode redeem baru nih! Yuk segera di redeem!

**Redeem Codes:**
${codes
  .map(
    (entry) =>
      `\`${entry.code.padEnd(maxCodeLength)}\` ・ **\`${entry.value.padEnd(
        maxValueLength
      )}\`** ${getCurrencyEmoji(gameType)} → [Link](${link[gameType]}${
        entry.code
      })`
  )
  .join("\n")}`
        );

      // Send to all output channels
      for (const channelId of gameType === "gi"
        ? OUTPUT_CHANNEL_GI
        : gameType === "hsr"
        ? OUTPUT_CHANNEL_HSR
        : OUTPUT_CHANNEL_ZZZ) {
        try {
          const targetChannel = await message.client.channels.fetch(channelId);
          if (targetChannel && targetChannel.isTextBased()) {
            await targetChannel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error(`Failed to send to channel ${channelId}:`, error);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      await message.reply(
        "Error: Invalid format. Please use: code1 item1,code2 item2"
      );
      setTimeout(() => message.delete(), 5000);
    }
  },
};
