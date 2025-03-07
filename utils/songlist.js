const { prisma } = require("../lib/prisma");

let songs = [];

const loadSong = async () => {
  const data = await prisma.songList.findMany();
  songs = data.map((entry) => entry.songName);

  console.log("Loaded songs:", songs);
  return songs;
};

const getSong = () => {
  return songs;
};

const updateSongList = async () => {
  songs = await loadSong();
};

module.exports = {
  loadSong,
  getSong,
  updateSongList,
};
