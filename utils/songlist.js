const { prisma } = require("../lib/prisma");

let songs = [];

const loadSong = async () => {
  const data = await prisma.songList.findMany();
  songs = [];
  if (!data.length) return;

  songs = data.map((entry) => entry.songName);

  console.log("Loaded songs:", songs);
  return songs;
};

module.exports = {
  loadSong,
};
