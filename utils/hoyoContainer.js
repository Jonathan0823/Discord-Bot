const { MessageFlagsBitField } = require("discord.js");
const { Wrapper } = require("enkanetwork.js");

async function hoyoContainer(message, type, id) {
  const { genshin, starrail } = new Wrapper({
    cache: true,
  });

  message.deferReply({
    flags: MessageFlagsBitField.Flags.Ephemeral,
  });

  try {
    if (type === "genshin") {
      const response = await genshin.getPlayer(id);
      console.log(response);
      await message.editReply(response.player.username);
    } else if (type === "starrail") {
      const response = await starrail.getPlayer(id);
      await message.editReply(response.player.username);
    } else {
      throw new Error("Invalid type");
    }
  } catch (error) {
    console.error("Error processing the hoyoContainer command:", error);
  }
}

module.exports = { hoyoContainer };
