const dotenv = require('dotenv');
const express = require ('express');
const mongoose = require('mongoose');
const app = express();
const hbs = require('hbs');
const path = require('path');
dotenv.config({ path:'./.env' });
const PORT = parseInt(process.env.PORT) || 3000;


//configur view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(path.join(__dirname, "./views/partials"));
app.use(express.static(__dirname + '/public'));


//link router file
app.use(require('./router/auth'));
app.use(express.static(__dirname));

// listen to PORT
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));