require('dotenv/config');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

// Load all commands from the commands directory
const commands = [];
const commandsPath = path.join(__dirname, "command");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command);
}



client.on("messageCreate", async (message) => {
  // Check if the message is from a bot or doesn't start with "?"
  if (message.author.bot || !message.content.startsWith("?")) return;

  // Extract the command from the message
  const args = message.content.slice(1).trim().split(/\s+/); // Split the message by spaces
  const commandName = args.shift().toLowerCase(); // Take the first word as the command name

  // Find and execute the command
  const command = commands.find((cmd) => cmd.data.name === commandName);
  if (command) {
    try {
      await command.execute(message, args); // Pass the remaining arguments to the command
    } catch (error) {
      console.error(error);
      await message.reply("There was an error executing that command!");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
