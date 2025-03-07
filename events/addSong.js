const { prisma } = require("../lib/prisma");
const { loadSong } = require("../utils/songlist");

const channelId = "1347471345356767294";
module.exports = {
  name: "messageCreate",
  async execute(message) {
    const isSongChannel = message.channel.id === channelId;

    if (!isSongChannel) return;

    const song = message.content;
    if (!song) return;

    try {
      await prisma.songList.create({
        data: {
          songName: song,
        },
      });

      await loadSong();

      await message.react("✅");
    } catch (err) {
      console.error("Error in adding song:", err);
    }
  },
};
