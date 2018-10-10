//This file has the keys for spotify
require("dotenv").config();
var keys = require('./keys.js');
//include the spotify npms
var SpotifyFile = require('node-spotify-api');
var spotify = new SpotifyFile(keys.spotify);

var Spotify = require('node-spotify-api');

//include the bandsintown npms
var bandsintown = require('bandsintown')("4f4d9337498f9cb795e4d17c16257319");

//include the omdb npms
var omdb = require('omdb');
const command = process.argv[2];

initProcess(command,process.argv[3]);

//This process parses the command arguments and branches the code to specific instruction
function initProcess(command,Value) {
  
  switch (command) {
    case "concert-this":
      const artist = Value;
      searchbands(artist);
      break;

    case "spotify-this-song":
      const song = Value;
      showSongInfo(song);
      break;

    case "movie-this":
      const movie = Value;
      showMovieInfo(movie);
      break;

    case "do-what-it-says":
      runFromRandom();
      break;

    default:
      break;
  }
}

//This function searches the band when artist name is given from the bandsintown API
function searchbands(artist) {
  bandsintown
    .getArtistEventList(artist)
    .then(function (events) {

      var eventInfo = JSON.stringify(events, null, 2);
      //console.log(events);
      events.forEach(event => {
        console.log(`
Venue : ${event.venue.name}, 
Location : ${event.venue.city}, ${event.venue.region}, ${event.venue.country}
Date of Event : ${event.formatted_datetime}`);

        var info = `
Venue : ${event.venue.name}, 
Location : ${event.venue.city}, ${event.venue.region}, ${event.venue.country}
Date of Event : ${event.formatted_datetime}`;
        logInfo(info);

      });

    });

}

//This function gets the song information from the spotify API
function showSongInfo(song) {

  spotify.search({
    type: 'track',
    query: song,
    limit: 5
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return; //from spotify npm docs
    } else {
      data.tracks.items.forEach(songinfo => {
        //console.log(songinfo);
        console.log(` 
      Artist : ${songinfo.artists[0].name} 
      Song Name : ${songinfo.name}
      Preview Link : ${songinfo.preview_url}
      Album name : ${songinfo.album.name}
       `);
       var info = `
       Artist : ${songinfo.artists[0].name} 
      Song Name : ${songinfo.name}
      Preview Link : ${songinfo.preview_url}
      Album name : ${songinfo.album.name}
       `;
       logInfo(info);
      });

    };
  });
}

//This function gets the movie information from the OMDB database
function showMovieInfo(movie) {
  var request = require("request");

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function (error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      //console.log(JSON.parse(body));
      var movieInfo = JSON.parse(body);
      console.log(
        `Title : ${movieInfo.Title}
Year : ${movieInfo.Year}
IMDB Rating : ${movieInfo.imdbRating}
Rotten Tomatoes Rating : ${ movieInfo.Ratings[1].Value}
Country : ${movieInfo.Country}
Language :  ${movieInfo.Language}
Plot of the movie : ${movieInfo.Plot}
Actors : ${movieInfo.Actors}`);
var info = 
`Title : ${movieInfo.Title}
Year : ${movieInfo.Year}
IMDB Rating : ${movieInfo.imdbRating}
Rotten Tomatoes Rating : ${ movieInfo.Ratings[1].Value}
Country : ${movieInfo.Country}
Language :  ${movieInfo.Language}
Plot of the movie : ${movieInfo.Plot}
Actors : ${movieInfo.Actors}`;
logInfo(info);
    }
  });
}

//This function reads the information in the file random.txt and parses the command and call the init to branch it to its respective branch
function runFromRandom() {
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function (error, data) {

   
    if (error) {
      return console.log(error);
    }   
    console.log(data);    
    var dataArr = data.split(","); 
    console.log(dataArr);
    
    
      initProcess(dataArr[0],dataArr[1]);
  });

}

//this function writes all the information to a file log.txt
function  logInfo(info)
{
  var fs = require("fs");
  fs.appendFile("log.txt", info, function(err) {

    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }
  
    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
      
    }
  
  });
}
