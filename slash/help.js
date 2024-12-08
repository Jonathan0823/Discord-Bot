const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with help!'),

    async execute(interaction) {
        await interaction.reply('**Suisei**\n- `?suisei`\n\n**Bocchi**\n- `?bocchi`\n\n**Hutao**\n- `?hutao`');
    }
}