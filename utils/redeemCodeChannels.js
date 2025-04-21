const { prisma } = require("../lib/prisma");

let codeChannels = [];

const allowedGameTypes = ["gi", "hsr", "zzz", "wuwa"];

const loadCodeChannels = async () => {
  const data = await prisma.codeChannel.findMany();
  codeChannels = data;

  console.log("Loaded code channels:");
  console.table(codeChannels);
};

const getCodeChannels = (gameType) => {
  const codes = codeChannels.filter((entry) => entry.gameType === gameType);
  return codes.map((entry) => entry.channelId);
};

const addCodeChannel = async (gameType, channelId) => {
  if (!allowedGameTypes.includes(gameType)) {
    throw new Error("Invalid game type.");
  }

  await prisma.codeChannel.create({
    data: {
      gameType,
      channelId,
    },
  });

  await loadCodeChannels();
};

module.exports = {
  loadCodeChannels,
  getCodeChannels,
  addCodeChannel,
};
