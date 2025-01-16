module.exports = {
    data: {
        name: "send",
        description: "Send a message to a channel",
    },
    execute: async (interaction) => {
        const currentChannel = interaction.channel;
        const sender = interaction.author.username;

        if (sender!== "lynz727wysi") {
            await interaction.reply("You are not authorized to use this command.");
            return;
        }
        
        try {
            // Initial reply
            await interaction.reply("Please enter the message you want to send.");
            
            const MessageFilter = m => m.author.username === sender;
            const collected = await currentChannel.awaitMessages({ 
                filter: MessageFilter,
                max: 1, 
                time: 60000,
                errors: ['time']
            });

            const message = collected.first().content;
            
            // Ask for channel ID
            await interaction.reply("Please enter the channel ID you want to send the message to.");
            
            const channelCollected = await currentChannel.awaitMessages({ 
                filter: MessageFilter,
                max: 1, 
                time: 60000,
                errors: ['time']
            });

            const channelId = channelCollected.first().content;
            
            // Fetch and validate channel
            const channel = await interaction.client.channels.fetch(channelId);
            if (!channel) {
                await interaction.reply("Channel not found.");
                return;
            }
        
            // Send the message
            await channel.send(message);
            await interaction.reply("Message sent successfully!");

        } catch (error) {
            if (error.name === 'DiscordAPIError') {
                await interaction.reply("Error: Could not find or access the specified channel.");
            } else if (error.message === 'time') {
                await interaction.reply("Time expired! Please try the command again.");
            } else {
                console.error(error);
                await interaction.reply("An error occurred while processing your command.");
            }
        }
    },
}