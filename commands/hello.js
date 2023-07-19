const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello to someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The usere to say hi to")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    interaction.reply(`Hello ${user.username} 😤`);
  },
};
