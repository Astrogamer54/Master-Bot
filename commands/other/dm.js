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
    const texttosend = interaction.options.get('message').value;
    console.log(texttosend)
    console.log(user)
    console.log(texttosend2)
    const texttosend2=toString(texttosend)
    try{
      user.send(texttosend2);
    }catch(err){
      return interaction.reply(err);
    }
    const embed = new MessageEmbed()
      .setTitle(user.username)
      .setDescription(`Dm'ed`, user.username,': ', texttosend2)
      .setImage(user.displayAvatarURL({ dynamic: true }))
      .setColor('0x00ae86');
    

    return interaction.reply({ embeds: [embed] });
  }
};
