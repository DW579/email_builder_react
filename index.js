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
          // Variables for deleting and downloading libraries


          // Delete old library on server and then download up to date library from GitHub
          // Promises for deleting
          const deleteImages = new Promise(function(resolve, reject) {
            fs.readdir(__dirname + '/whole_mod_library/mods/images', function (err, data) {
              if(err) {
                console.log("Error with reading images from mods folder");
                throw err;
              }

              if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                  fs.unlink(__dirname + '/whole_mod_library/mods/images/' + data[i], function (err) {
                      if(err) {
                        throw err;
                      }
                      console.log(data[i] + " deleted");
                  });
                }
              }

              resolve();
            })
          })
          const deleteMods = new Promise(function(resolve, reject) {
            fs.readdir(__dirname + '/whole_mod_library/mods', function (err, data) {
              if(err) {
                console.log("Error with readding mods folder");
                throw err;
              }

              if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                  if(data[i] !== "images") {
                    fs.unlink(__dirname + '/whole_mod_library/mods/' + data[i], function (err) {
                      if(err) {
                        throw err;
                      }
                      console.log(data[i] + " deleted");
                    });
                  }
                }
              }

              resolve();
            })
          });
          const deleteCssMods = new Promise(function(resolve, reject) {
            fs.readdir(__dirname + '/whole_mod_library/mods_css', function (err, data) {
              if(err) {
                console.log("Error with readding mods_css folder");
                throw err;
              }

              if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                  fs.unlink(__dirname + '/whole_mod_library/mods_css/' + data[i], function (err) {
                      if(err) {
                        throw err;
                      }
                      console.log(data[i] + " deleted");
                  });
                }
              }

              resolve();
            })
          });
          const deleteLibraryPieces = new Promise(function(resolve, reject) {
            fs.readdir(__dirname + '/whole_mod_library/library_pieces', function (err, data) {
              if(err) {
                console.log("Error with readding library_pieces folder");
                throw err;
              }

              if(data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                  fs.unlink(__dirname + '/whole_mod_library/library_pieces/' + data[i], function (err) {
                      if(err) {
                        throw err;
                      }
                      console.log(data[i] + " deleted");
                  });
                }
              }

              resolve();
            })
          });
          const deleteLinkDocs = new Promise(function(resolve, reject) {
            fs.unlink(__dirname + '/whole_mod_library/HW_MT_LINK_COMPLETE.xls', function (err) {
              if(err) {
                throw err;
              }

              console.log("HW_MT_LINK_COMPLETE.xls deleted");
            });

            fs.unlink(__dirname + '/whole_mod_library/HW_MT_LINK_SHELL.xls', function (err) {
              if(err) {
                throw err;
              }

              console.log("HW_MT_LINK_SHELL.xls deleted");
            });

            resolve();
          });
          // API header options for GitHub API and downloading the library files
          var getLibraryPieces = {
            method: 'GET',
            url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/library_pieces',
            headers: {
                'cache-control': 'no-cache',
                Authorization: process.env.githubKey,
                'user-agent': 'Request-Promise'
            },
            json: true
          };



          // Promise and then statements to delete all the old library files on the server
          return deleteImages.then(function() {
            return deleteMods.then(function() {
              return deleteCssMods.then(function() {
                return deleteLibraryPieces.then(function() {
                  return deleteLinkDocs.then(function() {
                    // GET requests for mod library download
                    // GET library_pieces files
                    return rp(getLibraryPieces).then(function(data) {
                      let allPromises = [];

                      for(let i = 0; i < data.length; i++) {
                        const getHeader = {
                          method: 'GET',
                          url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/library_pieces/' + data[i].name,
                          headers: {
                              'cache-control': 'no-cache',
                              Authorization: process.env.githubKey,
                              'user-agent': 'Request-Promise'
                          },
                          json: true
                        }
                        const getPromise = new Promise(function (resolve, reject) {
                          rp(getHeader).then(function(results) {
                            const buff = Buffer.alloc(results.size, results.content, 'base64');
                            const text = buff.toString("ascii");

                            fs.appendFileSync(__dirname + '/whole_mod_library/' + results.path, text, function (err) {
                              if (err) {
                                console.log("Error with writing file " + results.name);
                                throw err;
                              }
                              console.log('Saved ' + results.name + ' in folder /whole_mod_library/' + results.path);
                            });
                          })
                          .catch(function(err) {
                            console.log("Error with promise GET call to " + data[i].name);
                            throw err;
                          })

                          resolve();
                        })

                        allPromises.push(getPromise);
                      }

                      // Promise.all for library_pieces
                      return Promise.all(allPromises).then(function(results) {
                        console.log("Promise.all for library_pieces is finished");

                        console.log("Sent current date to front end, App.js");
                        res.json(dateOfUpdate);
                      })
                      .catch(function(err) {
                        console.log("Error on Promise.all for library_pieces");
                        throw err;
                      })
                    })
                    .catch(function(err) {
                      console.log("Error with GET call to library_pieces folder");
                      throw err;
                    })
                  })
                  .catch(function(err) {
                    console.log("Error with deleteLinkDocs");
                    throw err;
                  })
                })
                .catch(function(err) {
                  console.log("Error with deleteLibraryPieces");
                  throw err;
                })
              })
              .catch(function(err) {
                console.log("Error with deleteCssMods");
                throw err;
              })
            })
            .catch(function(err) {
              console.log("Error with deleteMods");
              throw err;  
            })
          })
          .catch(function(err) {
            console.log("Error with deleteImages");
            throw err;    
          })

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