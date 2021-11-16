const dotenv = require('dotenv');
const express = require ('express');
const path = require('path');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const bodyParser = require('body-parser');

//initiallize the app 
const app = express();

dotenv.config({ path:'./.env' });
const PORT = parseInt(process.env.PORT) || 3000;


//configur view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(path.join(__dirname, "./views/partials"));
app.use(express.static(__dirname + '/public'));

const SESS_SECRET = process.env.SESS_secret;
const SESS_NAME = process.env.SESS_name;

app.use(bodyParser.urlencoded({
    extended: true,
}))

app.use(session({
    name : SESS_NAME,
    resave : false,
    saveUninitialized : false,
    secret : SESS_SECRET,
    cookie :{
        maxAge : 1000*60*60,
        sameSite : true,
    }
}))

app.use(fileUpload());
//link database
require('./config/db');

app.get('*', (req,res,next)=>{
    res.locals.cart = req.session.cart;
    next();
});

//link routes file
app.use('/admin', require('./routes/admin'))
app.use('/cart', require('./routes/cart'));
app.use('/', require('./routes/index'))
app.use('/', require('./routes/auth'));
// listen to PORT
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));