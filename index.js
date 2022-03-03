// Import packages
const express = require('express');
const Nedb = require('nedb');
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