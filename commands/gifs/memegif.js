const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { tenorAPI } = require('../../config.json');

if (!tenorAPI) return;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memegif')
    .setDescription('Responds with a random meme gif'),
  execute(interaction) {
    fetch(`https://g.tenor.com/v1/random?key=${tenorAPI}&q=memes&limit=50`)
      .then(res => res.json())
      .then(json =>
        interaction.reply(json.results[Math.floor(Math.random() * 49)].url)
      )
      .catch(function onError() {
        interaction.reply(':x: Failed to find a gif!');
        return;
      });
  }
};
