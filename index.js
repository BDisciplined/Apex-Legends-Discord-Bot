const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
} = require("discord.js");

const fs = require("node:fs");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = getCommands("./commands");

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  let command = client.commands.get(interaction.commandName);

  try {
    if (interaction.replied) return;
    command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

// Log in to Discord with your client's token
client.login(token);

function getCommands(dir) {
  let commands = new Collection();
  const commandFiles = getFiles(dir);

  for (const commandFile of commandFiles) {
    const command = require(commandFile);
    commands.set(command.data.toJSON().name, command);
  }

  return commands;
}

function getFiles(dir) {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  let commandFiles = [];

  for (const file of files) {
    if (file.isDirectory()) {
      commandFiles = [...commandFiles, ...getFiles(`${dir}/${file.name}`)];
    } else if (file.name.endsWith(".js")) {
      commandFiles.push(`${dir}/${file.name}`);
    }
  }
  return commandFiles;
}
