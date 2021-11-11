const dotenv = require('dotenv');
const express = require ('express');
const mongoose = require('mongoose');
const app = express();

dotenv.config({ path:'./.env' });

//link router file
app.use(require('./router/auth'));
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;

// listen to PORT
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));