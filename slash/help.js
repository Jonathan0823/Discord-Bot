const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with help!'),

    async execute(interaction) {
        await interaction.reply('**Suisei**\n- `?sui`\n\n**Camellya**\n- `?cam`\n\n**Bocchi**\n- `?bocchi`**Yukinon**\n- `?yukinon`\n\n\n\n**Hutao**\n- `?hutao`');
    }
}