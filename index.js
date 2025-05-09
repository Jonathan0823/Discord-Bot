require("dotenv/config");
require("./server");
const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ActivityType,
  MessageFlagsBitField,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const { setupDailyAlarm, triggerAlarm, loadAlarmId } = require("./utils/alarm");
const { updateSongList, getSong } = require("./utils/songlist");
const { triggerWords, loadTriggerWords } = require("./events/triggerWord");
const { loadCodeChannels } = require("./utils/redeemCodeChannels");

client.on("ready", async () => {
  await loadAlarmId();
  await loadTriggerWords();
  await loadCodeChannels();

  setupDailyAlarm(client, "hoyo");

  client.user.setActivity("新星目録", {
    type: ActivityType.Listening,
  });

  console.log(`Logged in as ${client.user.tag}!`);

  await updateSongList();

  setInterval(() => {
    const songs = getSong();
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    client.user.setActivity(randomSong, {
      type: ActivityType.Listening,
    });
  }, 1000 * 60);
});

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

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command);
  commandMap.set(command.data.name, command);
}

for (const file of slashFiles) {
  const command = require(path.join(slashPath, file));
  slashCommands.push(command.data.toJSON());
  slashCommandMap.set(command.data.name, command);
}

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
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
      const handled = await triggerWords(interaction);
      if (handled) {
        return true;
      }

      if (
        !interaction.content ||
        interaction.author.bot ||
        !interaction.content.startsWith("?")
      ) {
        return false;
      }

      const args = interaction.content.slice(1).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();

      const command = commandMap.get(commandName);
      if (command) {
        try {
          if (interaction.replied || interaction.deferred) {
            console.log("Command already processed");
            return true;
          }

          await command.execute(interaction, args);
          return true;
        } catch (error) {
          console.error(`Error in message command ${commandName}:`, error);

          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply(
              "There was an error executing that command!"
            );
          }
          return true;
        }
      }
      return false;
    }

    if (isSlash) {
      if (!interaction.isCommand()) return false;

      const command = slashCommandMap.get(interaction.commandName);
      if (command) {
        try {
          await command.execute(interaction);
          return true;
        } catch (error) {
          console.error(
            `Error in slash command ${interaction.commandName}:`,
            error
          );

          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "There was an error executing this command!",
              flags: MessageFlagsBitField.Flags.Ephemeral,
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

client.on("messageCreate", async (message) => {
  if (message.content === "!alarm") {
    const channelId = [message.channel.id];
    await triggerAlarm(message.client, channelId, (type = "hoyo"));
    message.reply("Alarm triggered for testing!");
  }
  if (message.content === "!alarmwuwa") {
    const channelId = [message.channel.id];
    await triggerAlarm(message.client, channelId, (type = "wuwa"));
    message.reply("Alarm triggered for testing!");
  }
  await executeCommand(message, false);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  console.log("InteractionCreate Event - Processing Slash Command");
  await executeCommand(interaction, true);
});

client.login(process.env.DISCORD_BOT_TOKEN);
