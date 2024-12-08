const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping') // Nama slash command
    .setDescription('Replies with Pong!'), // Deskripsi command

  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};