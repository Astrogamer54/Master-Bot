const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help'),
  execute(interaction) {
    return interaction.reply(
      `Music
      Command	Description	Usage
      /play	Play any song or playlist from youtube, you can do it by searching for a song by name or song url or playlist url	!play darude sandstorm
      /pause	Pause the current playing song	!pause
      /resume	Resume the current paused song	!resume
      /leave	Leaves voice channel if in one	!leave
      /remove	Remove a specific song from queue by its number in queue	!remove 4
      /queue	Display the song queue	!queue
      /shuffle	Shuffle the song queue	!shuffle
      /skip	Skip the current playing song	!skip
      /skipall	Skip all songs in queue	!skipall
      /skipto	Skip to a specific song in the queue, provide the song number as an argument	!skipto 5
      /volume	Adjust song volume	!volume 80
      /music-trivia	Engage in a music trivia with your friends. You can add more songs to the trivia pool in resources/music/musictrivia.json	!music-trivia
      /loop	Loop the currently playing song or queue	!loop
      /lyrics	Get lyrics of any song or the lyrics of the currently playing song	!lyrics song-name
      /now-playing	Display the current playing song with a playback bar	!now-playing
      /move	Move song to a desired position in queue	!move 8 1
      /queue-historu	Display the queue history	!queue-history
      Other
      Command	Description	Usage
      /cat	Get a cute cat picture	!cat
      /dog	Get a cute dog picture	!dog
      /fortune	Get a fortune cookie tip	!fortune
      /insult	Generate an evil insult	!insult
      /chucknorris	Get a satirical fact about Chuck Norris	!chucknorris
      /motivation	Get a random motivational quote	!motivation
      /world-news	Latest headlines from reuters, you can change the news source to whatever news source you want, just change the source in line 13 in world-news.js or ynet-news.js	!world-news
      /random	Generate a random number between two provided numbers	!random 0 100
      /translate	Translate to any language using Google translate.(only supported languages)	!translate english ありがとう
      /about	Info about me and the repo	!about
      /8ball	Get the answer to anything!	!8ball Is this bot awesome?
      /rps	Rock Paper Scissors	!rps
      /bored	Generate a random activity!	!bored
      /advice	Get some advice!	!advice
      /kanye	Get a random Kanye quote	!kanye
      /urban dictionary	Get definitions from urban dictionary	!urban javascript
      GIFs
      Command	Description	Usage
      /gif	Get any gif by a query	!gif labrador
      /jojo	Replies with a jojo gif	!jojo`
    );
  }
};
