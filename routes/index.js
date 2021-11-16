const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const SESS_SECRET = process.env.SESS_secret;
const SESS_NAME = process.env.SESS_name;

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

router.use(bodyParser.urlencoded({
    extended: true,
}))

router.get('/', function(req,res){
    const userId =  req.session.userId;
    res.render('home',{
        user : userId,
    })
});

router.get('/babycare', function(req,res){
    const userId =  req.session.userId;
    res.render('babycare',{
        user : userId,
    })
});

router.get('/', function(req,res){
    const userId =  req.session.userId;
    res.render('home',{
        user : userId,
    })
});

router.get('/', function(req,res){
    const userId =  req.session.userId;
    res.render('home',{
        user : userId,
    })
});

router.get('/', function(req,res){
    const userId =  req.session.userId;
    res.render('home',{
        user : userId,
    })
});

module.exports = router;