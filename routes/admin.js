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
        res.redirect('/admin/login')
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

router.get('/', redirectLogin , require('./admin/order'));

router.get('/login', (req,res)=>{
    res.render('./admin/Alogin');
});

router.post('/login', (req,res)=>{

    const {name, password} = req.body;
    console.log(name,password);
    if(name==="admin" && password==="admin"){
        req.session.userId = 11111;
        return res.redirect('/admin/');
    }
});
router.use('/category',redirectLogin, require('./admin/category'));

router.use('/product',redirectLogin, require('./admin/product'))
module.exports = router;
