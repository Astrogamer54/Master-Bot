const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help'),
  execute(interaction) {
    return interaction.reply(
      'i cant send this cuz too long so https://rytm.astrogamer54.com/#commands'
    );
  }
};
