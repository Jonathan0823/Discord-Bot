require("dotenv/config");
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
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

// Load all commands from the commands directory
const commands = [];
const commandMap = new Map();
const commandsPath = path.join(__dirname, "command");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const slashCommands = [];
const slashCommandMap = new Map();
const slashPath = path.join(__dirname, "slash");
const slashFiles = fs
  .readdirSync(slashPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command);
  commandMap.set(command.data.name, command); // Add this line to create the map
}

for (const file of slashFiles) {
  const command = require(path.join(slashPath, file));
  slashCommands.push(command.data.toJSON());
  slashCommandMap.set(command.data.name, command);
}

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), {
      body: slashCommands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const executeCommand = async (interaction, isSlash = true) => {
  try {
    // For message commands
    if (!isSlash) {
      // Strict checks
      if (!interaction.content || interaction.author.bot || !interaction.content.startsWith("?")) {
        return false;
      }

      const args = interaction.content.slice(1).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();

      const command = commandMap.get(commandName);
      if (command) {
        try {
          // Prevent multiple executions by checking if already replied
          if (interaction.replied || interaction.deferred) {
            console.log("Command already processed");
            return true;
          }

          await command.execute(interaction, args);
          return true;
        } catch (error) {
          console.error(`Error in message command ${commandName}:`, error);
          
          // Only reply if not already replied
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply("There was an error executing that command!");
          }
          return true;
        }
      }
      return false;
    }

    // Slash command handling
    if (isSlash) {
      if (!interaction.isCommand()) return false;

      const command = slashCommandMap.get(interaction.commandName);
      if (command) {
        try {
          await command.execute(interaction);
          return true;
        } catch (error) {
          console.error(`Error in slash command ${interaction.commandName}:`, error);
          
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "There was an error executing this command!",
              ephemeral: true,
            });
          }
          return true;
        }
      }
      return false;
    }

    return false;
  } catch (globalError) {
    console.error("Global error in command execution:", globalError);
    return false;
  }
};

// Modify event listeners to be more specific
client.on("messageCreate", async (message) => {
  await executeCommand(message, false);
});

client.on("interactionCreate", async (interaction) => {
  // Only handle slash commands
  if (!interaction.isCommand()) return;
  
  console.log("InteractionCreate Event - Processing Slash Command");
  await executeCommand(interaction, true);
});

client.login(process.env.DISCORD_BOT_TOKEN);
