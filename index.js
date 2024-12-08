import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
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

client.on("messageCreate", async (message) => {
  // Check if the message is from a bot or doesn't start with "?"
  if (message.author.bot || !message.content.startsWith('?')) return;

  // Extract the command from the message
  const command = message.content.slice(1).trim().toLowerCase(); // Remove the "?" and trim spaces

  // Handle the "?sui" command
  if (command === "sui") {
    await message.channel.send("Sui!");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
