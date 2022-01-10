const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Info about the bot and its creator!'),
  execute(interaction) {
    return interaction.reply(
      'Made by @paint.exe#7378 with :heart: code is available on GitHub https://github.com/Astrogamer54/Master-Bot. Check out the website https://rytm.astrogamer54.com/'
    );
  }
};
