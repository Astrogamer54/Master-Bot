require('@lavaclient/queue/register');
const fs = require('fs');
const ExtendedClient = require('./utils/ExtendedClient');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {
  token,
  client_id,
  spotify_client_id,
  spotify_client_secret
} = require('./config.json');
const { load } = require('@lavaclient/spotify');
const { LoopType } = require('@lavaclient/queue');
const NowPlayingEmbed = require('./utils/music/NowPlayingEmbed');
const WelcomeEmbed = new MessageEmbed()
  .setTitle("Thank You For Inviting Rythm Reloaded")
  .setURL("https://rytm.astrogamer54.com/")
  .setColor('#920c0c')
  .setDescription("Rythm is dead. I am not.")
  .setFooter("Made By Astrogamer54", "https://lh6.googleusercontent.com/mdCKOXAmPmNswudMo-qACfMytGGd4vCmqpMQeKJQ5E2uSMzLw2oYgoRYFT3n8-fjIy8kh0d-Cb_lO4WZ7TPkiW4=w16383")
  .setThumbnail("https://rytm.astrogamer54.com/logo.gif")
let help = new MessageButton()
  .setStyle('LINK') //default: blurple
  .setLabel('Help') //default: NO_LABEL_PROVIDED
  .setURL('https://rytm.astrogamer54.com/#commands') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
let invite = new MessageButton()
  .setStyle('LINK') //default: blurple
  .setLabel('Invite') //default: NO_LABEL_PROVIDED
  .setURL('https://discord.com/oauth2/authorize?client_id=913903582082916444&scope=bot&permissions=277062192193') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
let sub = new MessageButton()
  .setStyle('LINK') //default: blurple
  .setLabel('Subscribe') //default: NO_LABEL_PROVIDED
  .setURL('https://www.youtube.com/c/Astrogamer54?sub_confirmation=1') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
const row = new MessageActionRow()
  .addComponents(
    help,
    invite,
    sub
  );
load({
  client: {
    id: spotify_client_id,
    secret: spotify_client_secret
  },
  autoResolveYoutubeTracks: true
});

const rest = new REST({ version: '9' }).setToken(token);

const client = new ExtendedClient();
client.commands = new Collection();
const commands = [];

client.music.on('connect', () => {
  console.log('Connected to LavaLink');
});

client.music.on('queueFinish', queue => {
  queue.channel.send({ content: 'No more songs in queue' });
  queue.player.disconnect();
  queue.player.node.destroyPlayer(queue.player.guildId);
});

client.music.on(
  'trackStart',
  async (queue, { title, uri, length, isSeekable }) => {
    if (client.triviaMap.has(queue.channel.guildId)) return;
    const queueHistory = client.queueHistory.get(queue.player.guildId);
    if (queue.loop.type == LoopType.Queue) {
      queue.tracks.push(queue.previous);
    }

    if (!queueHistory) {
      client.queueHistory.set(queue.player.guildId, []);
    }
    client.queueHistory.set(queue.player.guildId, [
      {
        title,
        uri,
        length,
        isSeekable
      },
      ...client.queueHistory.get(queue.player.guildId)
    ]);

    const embed = NowPlayingEmbed(
      queue.current,
      undefined,
      queue.current.length
    );
    queue.channel.send({ embeds: [embed] },help,invite,sub);
  }
);

client.on('ready', () => {
  client.music.connect(client.user.id);
  client.user.setPresence({
    activities: [{ name: 'Slash commands /', type: 'WATCHING' }]
  });
  console.log('ready!');
});

client.on('guildCreate', guild => {
  guild.systemChannel.send({ embeds: [WelcomeEmbed], components: [row] })
})

const commandFiles = fs
  .readdirSync('./commands')
  .map(folder =>
    fs
      .readdirSync(`./commands/${folder}`)
      .filter(file => file.endsWith('.js'))
      .map(file => `./commands/${folder}/${file}`)
  )
  .flat();

for (const file of commandFiles) {
  const command = require(`${file}`);
  if (Object.keys(command).length === 0) continue;
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(client_id), {
      body: commands
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const eventFiles = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
client.login(token);
