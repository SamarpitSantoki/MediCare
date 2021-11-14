const dotenv = require('dotenv');
const express = require ('express');
const path = require('path');
const hbs = require('hbs');

//initiallize the app 
const app = express();

dotenv.config({ path:'./.env' });
const PORT = parseInt(process.env.PORT) || 3000;


//configur view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(path.join(__dirname, "./views/partials"));
app.use(express.static(__dirname + '/public'));

//link database
require('./config/db');


//link routes file
app.use('/admin', require('./routes/admin'))
app.use('/', require('./routes/auth'));

// listen to PORT
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));