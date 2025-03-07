const { prisma } = require("../lib/prisma");

let songs = [
  "Starry Jet",
  "Ghost",
  "Stellar Stellar",
  "Bluerose",
  "デビュタントボール",
  "Next Color Planet",
  "3時12分",
  "ソワレ",
  "Awake",
  "ムーンライト",
  "みちづれ",
  "Comet",
  "Andromeda",
  "Newton",
  "流星群",
  "綺麗事",
  "Light the Light",
  "ビビデバ",
  "Midnight Mission",
  "Damn Good Day",
  "Caramel Pain",
  "DEADPOOL",
  "繭と心",
  "ビーナスバグ",
  "Orbital Period",
  "もうどうなってもいいや",
  "ジュビリー",
  "Template",
  "レクイエム",
  "The Last Frontier",
  "シュガーラッシュ",
  "Capsule",
  "Out of Frame",
  "自分勝手Dazzling",
  "駆けろ",
];

const loadSong = async () => {
  const data = await prisma.songList.findMany();
  songs = [];
  if (!data.length) return;

  songs = data.map((entry) => entry.songName);

  console.log("Loaded songs:", songs);
  return songs;
};

module.exports = {
  songs,
  loadSong,
};
