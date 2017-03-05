var request = require('request');
var cheerio = require('cheerio');
var tabletojson = require('tabletojson');

var scrape = function(tid) {

  // tournamentId is a four/five digit number where digit 1/1 and 2 represents the month of the year.
  var url = 'http://www.espn.com/golf/leaderboard?tournamentId='

  // Number of places to scrape.
  var numToScrape = 15;

  tabletojson.convertUrl(url + '2696', function(tables) {
    // If our tid doesn't return any table, then it's an invalid id. Return 'null';
    if (tables.length === 0) {
      console.log('Invalid tid. Nothing to return.');
      return null;
    }



    var table = tables[0];

    // If the round is not complete, don't save and return null
    if (table[0]['R4'] === '--') {
      console.log('Tourney not complete. Returning null.');
      return null;
    }

    // A table has multiple rows, with each row being an object.
    // Each row object has the following k:v pairs
    //
    // integer denoting row number (1 based indexing)
    // 'POS' -- player position
    // 'PLAYER' -- player name in 'FIRST LASTM_INITIAL    LAST'
    // 'TO PAR' -- string integer denoting relative score  ('-12', for example)
    // 'TODAY' -- string integer denoting today's relative score
    // 'THRU' -- integer if round in progress, 'F' if round finished
    // 'R1' - 'R4' -- integers denoting round score
    // 'TOT' -- sum of round scores
    // 'EARNINGS' -- purse won
    // 'FEDEX PTS' -- number of points won toward FedEx cup
    // 'TEE TIME' -- player's tee time

    // Construct our position object. Only save players up to T10

    var data = [];
    for (var i = 0; i < table.length; i++) {
      var row = table[i];

      var position = row['POS'].split('T').join('');
      if (parseInt(position) <= numToScrape) {
        var player = {};

        player.name = row['PLAYER'];
        player.position = row['POS'];
        data.push(player);
      }
    }
    
    // return the constructed data object for parsing elsewhere.
    return data;

  });
}

var scrapeTids = function(tid) {
  // Attempts to scrape Tids and the tournament name from the lower bound tid to the upper bound.

  var url = 'http://www.espn.com/golf/leaderboard?tournamentId=';

  request(url + tid.toString(), function(err, res, data) {
    if (!err) {
      $ = cheerio.load(data);

      var text = $('title').text();
      text = text.split(' Golf Leaderboard and Results- ESPN').join('');
      return [tid, text];
    }
  });
}

module.exports = scrapeTids;