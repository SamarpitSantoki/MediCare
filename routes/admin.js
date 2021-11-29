const express = require("express");
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const SESS_SECRET = process.env.SESS_secret;
const SESS_NAME = process.env.SESS_name;

router.use(bodyParser.urlencoded({
    extended: true,
}))

router.use(session({
    name : SESS_NAME,
    resave : false,
    saveUninitialized : false,
    secret : SESS_SECRET,
    cookie :{
        maxAge : 1000*60*60,
        sameSite : true,
    }
}))

const redirectLogin = (req,res,next) => {
    if (!req.session.userId){
        res.redirect('/login')
    }else{
        next()
    }
}

const redirectHome = (req,res,next) => {
    if (req.session.userId){
        res.redirect('/')
    }else{
        next()
    }
}

router.get('/', require('./admin/order'));

router.use('/category', require('./admin/category'));

router.use('/product', require('./admin/product'))
module.exports = router;
