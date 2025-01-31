const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const { SpotifyItemType } = require('@lavaclient/spotify');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play any song or playlist from YouTube and Spotify!')
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('What song or playlist would you like to listen to?')
        .setRequired(true)
    ),
  async execute(interaction) {
    const client = interaction.client;

    if (client.triviaMap.has(interaction.guildId)) {
      return interaction.reply(
        'You cannot use this command while a music trivia is playing!'
      );
    }

    await interaction.deferReply({
      fetchReply: true
    }); 
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.followUp('Join a voice channel and try again!');
    }
    let song = interaction.options.get('song').value; // the user's song

    let player = client.music.players.get(interaction.guildId);
    if (player && player.channelId !== voiceChannel.id) {
      return interaction.followUp(`Join <#${player.channelId}`);
    }

    // If user wants to play a track from the history queue
    const queueHistory = interaction.client.queueHistory.get(
      interaction.guildId
    );
    if (Number(song) && queueHistory.length > 0) {
      const index = String(Number(song) - 1);
      song = queueHistory[index].title;
    }

    let tracks = [];
    let displayMessage = '';

    if (client.music.spotify.isSpotifyUrl(song)) {
      const item = await client.music.spotify.load(song);
      switch (item.type) {
        case SpotifyItemType.Track:
          const track = await item.resolveYoutubeTrack();
          tracks = [track];
          displayMessage = `Queued track [**${item.name}**](${song}).`;
          break;
        case SpotifyItemType.Artist:
          tracks = await item.resolveYoutubeTracks();
          displayMessage = `Queued the **Top ${tracks.length} tracks** for [**${item.name}**](${song}).`;
          break;
        case SpotifyItemType.Album:
        case SpotifyItemType.Playlist:
          tracks = await item.resolveYoutubeTracks();
          displayMessage = `Queued **${
            tracks.length
          } tracks** from ${SpotifyItemType[item.type].toLowerCase()} [**${
            item.name
          }**](${song}).`;
          break;
        default:
          return interaction.followUp({
            content: `Couldn't find what you were looking for :(`,
            ephemeral: true
          });
      }
    } else {
      const results = await client.music.rest.loadTracks(
        /^https?:\/\//.test(song) ? song : `ytsearch:${song}`
      );

      switch (results.loadType) {
        case 'LOAD_FAILED':
        case 'NO_MATCHES':
          return interaction.followUp({
            content: `Couldn't find what you were looking for :(`,
            ephemeral: true
          });
        case 'PLAYLIST_LOADED':
          tracks = results.tracks;
          displayMessage = `Queued playlist [**${results.playlistInfo.name}**](${song}), it has a total of **${tracks.length}** tracks.`;
          break;
        case 'TRACK_LOADED':
        case 'SEARCH_RESULT':
          const [track] = results.tracks;
          tracks = [track];
          displayMessage = `Queued [**${track.info.title}**](${track.info.uri})`;
          break;
      }
    }

    // create a player if missing
    if (!player) {
      player = client.music.createPlayer(interaction.guildId);
      player.queue.channel = interaction.channel;
      await player.connect(voiceChannel.id, { deafened: true });
    }

    const started = player.playing || player.paused;

    await interaction.followUp(displayMessage);
    console.log(displayMessage);

    player.queue.add(tracks, {
      requester: interaction.user.id
    });
    if (!started) {
      await player.setVolume(50); // default 100 is too much, todo: import this from db at startup
      await player.queue.start();
    }
  }
};
