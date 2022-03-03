// Import packages
const express = require('express');
const Nedb = require('nedb');
require("dotenv").config();
// Initialize app and DB
const app = express();
const database = new Nedb('database.db');
// Run API on server
const port = process.env.PORT || 3040;
app.listen(port, ()=> {
    console.log('Im listening');
    console.log('Go to: localhost:3040 and spin the wheel!');
});
// Start DB
database.loadDatabase();
// Set app usage
app.use(express.static('public'));
app.use(express.json());

// Set get endpoint
app.get('/cookie', (request, response) => {
    const CookieName = process.env.COOKIE_NAME;
    const CookieTime = process.env.COOKIE_TIME; // minutes
    response.json({
        status: "success",
        name: CookieName,
        time: CookieTime,
    });
})
app.get('/slice-api', (request, response) => {
  console.log("There is a get request");
  database.find({}, (err, docs) => {
      if (err) {
          response.end();
          return
      }
      response.json({
          status: "success",
          docs: docs,
      });
  });
})

// Set post endpoint
app.post('/slice-api', (request, response) => {
  database.remove({}, { multi: true }, function (err, numRemoved) {
  });
  console.log('I have a request!');
  const data = request.body;
  database.insert(data);
  response.json({
      status: "success",
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
      image: data.image,
  })
})