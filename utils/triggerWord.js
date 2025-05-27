import prisma from "../lib/prisma.js";

let triggers = {};

const loadTriggerWords = async () => {
  try {
    const triggerWords = await prisma.triggerWord.findMany();

    triggers = {};

    triggerWords.forEach(({ key, word }) => {
      triggers[key] = word;
    });

    console.log(triggers);

    console.log("Trigger Words Loaded!");
  } catch (err) {
    console.error(err);
    return {};
  }
};

const triggerWords = async (interaction) => {
  if (!interaction.content || interaction.author.bot) return;
  const message = interaction.content.toLowerCase();

  if (triggers[message]) {
    await interaction.channel.send(triggers[message]);
    return true;
  }
};

export { triggerWords, loadTriggerWords };
