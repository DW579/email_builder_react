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
var optionTop = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/library_pieces/library_top.html',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};
var optionsCSS = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/mods_css',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};
var optionMiddle = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/library_pieces/library_middle.html',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};
var options = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/mods',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};
var optionBottom = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/library_pieces/library_bottom.html',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};
var optionImage = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/mods/images',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};
var optionLinkDoc = {
  method: 'GET',
  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/HW_MT_LINK_COMPLETE.xls',
  headers: {
      'cache-control': 'no-cache',
      Authorization: process.env.githubKey,
      'user-agent': 'Request-Promise'
  },
  json: true
};

// All API endpoints
app.get('/data', (req, res) => {
  // Non-production date, so that I am not wasting API calls to GitHub
  let date = "2019-03-14";

  res.json(date);

  // let date = "";

  // rp(optionDate)
  //     .then(function (data) {
  //         for (var i = 0; i < 10; i++) {
  //             date += data.updated_at[i];
  //         }

  //         res.json(date);
  //     })
  //     .catch(function (err) {
  //         console.log("Error thrown for getting the date");
  //         date = "Error with API GET request of date";

  //         // res.render('library_build', { date: date });
  //     })
});

app.get('/library', (req, res) => {
  console.log("Download library");
  // let date = "2019-03-14";

  // res.json(date);

  var cssContent = [];
  var htmlContent = [];
  var date = "";
  var file = __dirname + '/mod_library/hotwire_library_' + date + '.html';
  var zipFile = [{ path: __dirname + '/mod_library/HW_MT_LINK_COMPLETE.xls', name: 'HW_MT_LINK_COMPLETE.xls' }];
  var imageFolder = __dirname + '/mod_library/images';
  var linkDoc = __dirname + '/mod_library/HW_MT_LINK_COMPLETE.xls';

  // Check image folder for images and if there are, delete them
  fs.readdir(imageFolder, function (err, data) {
      if (err) {
          throw err;
      }
      if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
              fs.unlink(imageFolder + "/" + data[i], function (err) {
                  if (err) {
                      throw err;
                  }
                  console.log(data[i] + " deleted");
              });
          }
      }
  });

  // Delete link doc, if it exist
  if (fs.existsSync(linkDoc)) {
      fs.unlinkSync(linkDoc, function (err) {
          if (err) throw err;
          console.log("File HW_MT_LINK_COMPLETE.xls was deleted!");
      });
  }

  rp(optionDate)
      .then(function (data) {
          for (var i = 0; i < 10; i++) {
              if (data.updated_at[i] !== "-") {
                  date += data.updated_at[i];
              }
          };

          // Delete hotwire_library.html if it exist
          if (fs.existsSync(file)) {
              fs.unlinkSync(file, function (err) {
                  if (err) throw err;
                  console.log("File hotwire_library_" + date + ".html was deleted!");
              });
          };

          // Request and append top portion of html code
          return rp(optionTop)
              .then(function (topData) {
                  var buff = Buffer.alloc(topData.size, topData.content, 'base64');
                  var text = buff.toString("ascii");

                  fs.writeFileSync('mod_library/hotwire_library_' + date + '.html', text, function (err) {
                      if (err) throw err;
                      console.log('Saved!');
                  });

                  // Request for all of the CSS files
                  return rp(optionsCSS)
                      .then(function (cssFiles) {
                          var cssAPIs = [];
                          var cssPromises = [];

                          // Setting up the API options to call each CSS file
                          for (var i = 0; i < cssFiles.length; i++) {
                              var singleCssAPI = {
                                  method: 'GET',
                                  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/mods_css/' + cssFiles[i].name,
                                  headers: {
                                      'cache-control': 'no-cache',
                                      Authorization: process.env.githubKey,
                                      'user-agent': 'Request-Promise'
                                  },
                                  json: true
                              };

                              cssAPIs.push(singleCssAPI);
                          };

                          // Creating an array of Promises for the CSS files
                          for (var i = 0; i < cssAPIs.length; i++) {
                              var initalPromise = new Promise(function (resolve, reject) {
                                  rp(cssAPIs[i])
                                      .then(function (result) {
                                          var arr = [result.name];
                                          var buff = Buffer.alloc(result.size, result.content, 'base64');
                                          var text = buff.toString("ascii");

                                          arr.push(text);

                                          cssContent.push(arr);

                                          resolve();
                                      })
                                      .catch(function (err) {
                                          console.log(err);
                                      })
                              });

                              cssPromises.push(initalPromise);
                          };

                          // Request and append all CSS code
                          return Promise.all(cssPromises)
                              .then(function (results) {
                                  console.log("promise.all for CSS finshed");

                                  // Sort and write css code to the new file
                                  cssContent.sort();

                                  for (var i = 0; i < cssContent.length; i++) {
                                      fs.appendFileSync('mod_library/hotwire_library_' + date + '.html', cssContent[i][1], function (err) {
                                          if (err) throw err;
                                          console.log('Saved!');
                                      });
                                  };

                                  // Request and append middle portion of html
                                  return rp(optionMiddle)
                                      .then(function (middleData) {
                                          var buff = Buffer.alloc(middleData.size, middleData.content, 'base64');
                                          var text = buff.toString("ascii");

                                          fs.appendFileSync('mod_library/hotwire_library_' + date + '.html', text, function (err) {
                                              if (err) throw err;
                                              console.log('Saved!');
                                          });

                                          // Request and append HTML mods
                                          return rp(options)
                                              .then(function (mods) {
                                                  var mulitpleAPIs = [];
                                                  var promiseArr = [];

                                                  // Creating the API Headers for HTML files
                                                  for (var i = 0; i < mods.length; i++) {
                                                      if (mods[i].name !== "images") {
                                                          var singleAPI = {
                                                              method: 'GET',
                                                              url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/mods/' + mods[i].name,
                                                              headers: {
                                                                  'cache-control': 'no-cache',
                                                                  Authorization: process.env.githubKey,
                                                                  'user-agent': 'Request-Promise'
                                                              },
                                                              json: true
                                                          };

                                                          mulitpleAPIs.push(singleAPI);
                                                      };
                                                  };

                                                  // Creating the new Promises
                                                  for (var i = 0; i < mulitpleAPIs.length; i++) {
                                                      var freshPromise = new Promise(function (resolve, reject) {
                                                          rp(mulitpleAPIs[i])
                                                              .then(function (result) {
                                                                  var arr = [result.name];
                                                                  var buff = Buffer.alloc(result.size, result.content, 'base64');
                                                                  var text = buff.toString("ascii");

                                                                  arr.push(text);

                                                                  htmlContent.push(arr);

                                                                  resolve();
                                                              })
                                                              .catch(function (err) {
                                                                  console.log(err);
                                                              })
                                                      });

                                                      promiseArr.push(freshPromise);
                                                  };

                                                  // Request and append all HTML mods
                                                  return Promise.all(promiseArr)
                                                      .then(function (results) {
                                                          console.log("promise.all finshed");

                                                          // Sort and write html code to the new file
                                                          htmlContent.sort();
                                                          for (var i = 0; i < htmlContent.length; i++) {
                                                              fs.appendFileSync('mod_library/hotwire_library_' + date + '.html', htmlContent[i][1], function (err) {
                                                                  if (err) throw err;
                                                                  console.log('Saved!');
                                                              });
                                                          };

                                                          return rp(optionBottom)
                                                              .then(function (result) {
                                                                  var buff = Buffer.alloc(result.size, result.content, 'base64');
                                                                  var text = buff.toString("ascii");

                                                                  fs.appendFileSync('mod_library/hotwire_library_' + date + '.html', text, function (err) {
                                                                      if (err) {
                                                                          console.log("Error with appending bottom of HTML portion");
                                                                          throw err;
                                                                      }
                                                                      console.log('Saved!');
                                                                  });

                                                                  // Request and append images
                                                                  return rp(optionImage)
                                                                      .then(function (imageFiles) {
                                                                          var imageAPIs = [];
                                                                          var imagesPromises = [];

                                                                          // Setting up the API options to call each CSS file
                                                                          for (var i = 0; i < imageFiles.length; i++) {
                                                                              var singleImageAPI = {
                                                                                  method: 'GET',
                                                                                  url: 'https://api.github.com/repos/omccreativeservices/hotwire_template/contents/mods/images/' + imageFiles[i].name,
                                                                                  headers: {
                                                                                      'cache-control': 'no-cache',
                                                                                      Authorization: process.env.githubKey,
                                                                                      'user-agent': 'Request-Promise'
                                                                                  },
                                                                                  json: true
                                                                              };
                                                                              imageAPIs.push(singleImageAPI);
                                                                          };

                                                                          // Creating an array of Promises for the Image files (Come back to figure out why the api calls are being made in the for loop, when I need it to do it with a Promise.all)
                                                                          for (var i = 0; i < imageAPIs.length; i++) {
                                                                              var promise = new Promise(function (resolve, reject) {
                                                                                  rp(imageAPIs[i])
                                                                                      .then(function (result) {
                                                                                          var buff = Buffer.alloc(result.size, result.content, 'base64');
                                                                                          var obj = { path: __dirname + "/mod_library/images/" + result.name, name: "images/" + result.name };

                                                                                          fs.appendFile('mod_library/images/' + result.name, buff, function (err) {
                                                                                              if (err) throw err;
                                                                                              console.log('Image saved');
                                                                                          });

                                                                                          zipFile.push(obj);

                                                                                          resolve();
                                                                                      })
                                                                                      .catch(function (err) {
                                                                                          console.log(err);
                                                                                      })
                                                                              })
                                                                              imagesPromises.push(promise);
                                                                          };

                                                                          // Request and append for images
                                                                          return Promise.all(imagesPromises)
                                                                              .then(function (imagesPromises) {
                                                                                  console.log("Finished with Promise.all for images");

                                                                                  // Request and append Link Doc
                                                                                  return rp(optionLinkDoc)
                                                                                      .then(function (topData) {
                                                                                          var htmlFile = { path: __dirname + '/mod_library/hotwire_library_' + date + '.html', name: 'hotwire_library_' + date + '.html' };
                                                                                          var buff = Buffer.alloc(topData.size, topData.content, 'base64');

                                                                                          fs.appendFile('mod_library/HW_MT_LINK_COMPLETE.xls', buff, function (err) {
                                                                                              if (err) throw err;
                                                                                              console.log('Saved!');
                                                                                          });

                                                                                          zipFile.push(htmlFile);

                                                                                          // Zip up and download files: html library, images, and link doc
                                                                                          res.zip(zipFile);

                                                                                          // Delete html file and link doc after 5 seconds
                                                                                          setTimeout(function () {
                                                                                              // Delete hotwire_library.html after zip download (find better solution then just a setTimeout)
                                                                                              fs.unlinkSync(__dirname + '/mod_library/hotwire_library_' + date + '.html', function (err) {
                                                                                                  if (err) throw err;
                                                                                                  console.log("File hotwire_library_" + date + ".html was deleted!");
                                                                                              });

                                                                                              // Delete HW_MT_LINK_COMPLETE.xls after zip download (find better solution then just a setTimeout)
                                                                                              fs.unlinkSync(linkDoc, function (err) {
                                                                                                  if (err) throw err;
                                                                                                  console.log("File HW_MT_LINK_COMPLETE.xls was deleted!");
                                                                                              });
                                                                                          }, 5000);

                                                                                      })
                                                                                      .catch(function (err) {
                                                                                          console.log("Error with Link Doc request");
                                                                                          console.log(err);
                                                                                      })
                                                                              })
                                                                              .catch(function (err) {
                                                                                  console.log("Error with Promise.all for images");
                                                                                  console.log(err);
                                                                              })
                                                                      })
                                                                      .catch(function (err) {
                                                                          console.log("Error with request for Images");
                                                                          console.log(err);
                                                                      })
                                                              })
                                                              .catch(function (err) {
                                                                  console.log("Error with request for bottom portion of HTML");
                                                                  console.log(err);
                                                              })
                                                      })
                                                      .catch(function (err) {
                                                          console.log("Error with Promise.all for request and append HTML code");
                                                          console.log(err);
                                                      })
                                              })
                                              .catch(function (err) {
                                                  console.log("Error with request for all HTML code");
                                                  console.log(err);
                                              })
                                      })
                                      .catch(function (err) {
                                          console.log("Error with the request with the middle portion of html");
                                          console.log(err);
                                      })
                              })
                              .catch(function (err) {
                                  console.log("Error with the Promise.all of the css code");
                                  console.log(err);
                              })
                      })
                      .catch(function (err) {
                          console.log("Error with the css file request");
                          console.log(err);
                      })
              })
              .catch(function (err) {
                  console.log("Error with request of top portion of html request");
                  console.log(err);
              })
      })
      .catch(function (err) {
          console.log("Error with request for GitHub repo date");
          console.log(err);
      })
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname + '/client/build/index.html'));
  res.send("Catch all page");
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on port ${port}`);