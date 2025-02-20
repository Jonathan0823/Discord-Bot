const { MessageFlagsBitField } = require("discord.js");
const { Wrapper } = require("enkanetwork.js");

async function hoyoContainer(message, type, id) {
  const wrapper = new Wrapper({
    cache: true,
  });

  message.deferReply({
    flags: MessageFlagsBitField.Flags.Ephemeral,
  });

  try {
    const response = await wrapper[type].getPlayer(id);
    await message.editReply(response.player?.username);
  } catch (error) {
    console.error("Error processing the hoyoContainer command:", error);
    await message.editReply("An error occurred while processing the command.");
  }
}

module.exports = { hoyoContainer };
