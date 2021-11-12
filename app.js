const dotenv = require('dotenv');
const express = require ('express');
const mongoose = require('mongoose');
const app = express();
dotenv.config({ path:'./.env' });
const PORT = parseInt(process.env.PORT) || 3000;


//link router file
app.use(require('./router/auth'));
app.use(express.static(__dirname));

// listen to PORT
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));