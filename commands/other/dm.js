const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription(`DM a user!`)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user which avatar you want to DM')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('message to dm')
        .setRequired(true)
    ),

  execute(interaction) {
    const user = interaction.options.get('user').user;
    const message = interaction.options.get('message').string;
    try{
      user.send(message);
    }catch(err){
      return interaction.reply('Could not send DM');
    }
    const embed = new MessageEmbed()
      .setTitle(user.username)
      .setDescription(`Dm'ed`, user.username,': ', message)
      .setImage(user.displayAvatarURL({ dynamic: true }))
      .setColor('0x00ae86');
    

    return interaction.reply({ embeds: [embed] });
  }
};
