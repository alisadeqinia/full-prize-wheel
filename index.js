// Import packages
const express = require('express');
const Nedb = require('nedb');
require("dotenv").config();
// Initialize app and DB
const app = express();
const database = new Nedb('database.db');
// Start DB
database.loadDatabase();
// Set app usage
app.use(express.static('public')); // client side files
app.use(express.json()); // get and post res, req can be json
app.use(express.urlencoded()); // to parse body of request.

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
          console.error(err);
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
  database.remove({}, {multi: true}, function (err, numRemoved) {
  });
  console.log('Client has a request!');
  database.insert(request.body, function (err, docs) {
    if (err) {
        response.end();
        console.error(err);
        return
    }
  });
  response.send(
      `تغییرات شما ثبت شد
      <br>
      <a href="/">برو به گردونه شانس</a>`
    )
})

// Run API on server
const port = process.env.PORT || 3040;
app.listen(port, ()=> {
    console.log('Im listening');
    console.log('Go to: localhost:3040 and spin the wheel!');
});