const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlagsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purgeall")
    .setDescription(
      "Purge all messages in the channel (max 100, within 14 days)"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    try {
      await interaction.deferReply({
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        return interaction.editReply(
          "You do not have the required permissions to use this command!"
        );
      }

      const messages = await interaction.channel.messages.fetch({ limit: 100 });

      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const filteredMessages = messages.filter(
        (msg) => msg.createdTimestamp > twoWeeksAgo
      );

      if (filteredMessages.size === 0) {
        return interaction.editReply(
          "No messages found within the last 14 days to delete."
        );
      }

      await interaction.channel.bulkDelete(filteredMessages, true);
      await interaction.editReply(
        `Purged ${filteredMessages.size} messages from the last 14 days!`
      );
    } catch (error) {
      console.error("Error processing the purgeall command:", error);

      if (!interaction.replied) {
        await interaction.editReply(
          "An error occurred while processing your command!"
        );
      }
    } finally {
      setTimeout(() => {
        interaction.deleteReply();
      }, 3000);
    }
  },
};
