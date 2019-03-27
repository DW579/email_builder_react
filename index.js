const express = require('express');
const path = require('path');
const rp = require('request-promise');
require('dotenv').config()

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API Objects
const optionDate = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};

// All API endpoints
app.get('/data', (req, res) => {
  // const data = [
  //   {id: 1, name: "John"},
  //   {id: 2, name: "Sus"}
  // ];

  let date = "";

  rp(optionDate)
      .then(function (data) {
          for (var i = 0; i < 10; i++) {
              date += data.updated_at[i];
          }

          // res.render('library_build', { date: date });
          res.json(date);
      })
      .catch(function (err) {
          console.log("Error thrown for getting the date");
          date = "Error with API GET request of date";

          // res.render('library_build', { date: date });
      })

  // res.json(data);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname + '/client/build/index.html'));
  res.send("Catch all page");
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on port ${port}`);