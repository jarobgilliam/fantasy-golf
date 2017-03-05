var express = require('express');
var app = express();
var scrape = require('./scraper');

app.use(express.static('client'));

// Attempt scrape
scrape(2696);

app.listen(3000, function() {
  console.log('Fantasy Golf listening on 3000...');
});