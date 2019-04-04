const express = require('express');
const path = require('path');
const rp = require('request-promise');
require('dotenv').config()
const fs = require('fs');
const zip = require('express-zip');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API Objects
var optionDate = {
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
app.get('/date', (req, res) => {

  // Read modLibraryDate.json to know the date of mob library on local server
  fs.readFile('./whole_mod_library/modLibraryDate.json', 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const modLibraryDate = JSON.parse(data).modLibraryDate;

    // Simplify the date on server of mod library to format: 00/00/0000
    function serverLibraryDate() {
      const serverDate = modLibraryDate.slice(5, 7) + "/" + modLibraryDate.slice(8, 10) + "/" + modLibraryDate.slice(0, 4);

      return serverDate;
    }

    // GET request to GitHub for date of mod library's last update
    rp(optionDate)
      .then(function (data) {

        // Compare GitHub date and Server date, if !== then delete library on server and GET request library from GitHub
        if(data.updated_at !== modLibraryDate) {
          const dateOfUpdate = data.updated_at.slice(5, 7) + "/" + data.updated_at.slice(8, 10) + "/" + data.updated_at.slice(0, 4);

          // Delete old library on server and then download up to date library from GitHub


          // After up to date library from GitHub is finished being downloaded into server, update modLibraryDate.json with current date

          console.log("Sent current date to front end, App.js");
          res.json(dateOfUpdate);
        }
        else {
          console.log("GitHub and Server dates are same for mod library");
          res.json(serverLibraryDate());
        }

      })
      .catch(function (err) {

          console.log("Error thrown for getting the date from GitHub");
          throw err;
          
      })
  });

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