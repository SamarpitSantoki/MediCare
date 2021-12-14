const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const SESS_SECRET = process.env.SESS_secret;
const SESS_NAME = process.env.SESS_name;

const Product = require('../model/productSchema');

router.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: true,
    }
}))

router.use(bodyParser.urlencoded({
    extended: true,
}))

router.get('/', function (req, res) {
    const userId = req.session.userId;
    Product.find((err, products) => {
        let arr = [];
        let length = products.length;
        for(let i=0; i<20; i++){
            arr.push(products[Math.floor(Math.random()*length)]);
        }
        res.render('home', {
            user: userId,
            products: arr
        });
    });
});

router.get('/babycare', function (req, res) {
    const userId = req.session.userId;
    Product.find({ category: "baby-care" }, (err, products) => {
        res.render('babycare', {
            user: userId,
            products: products
        });
    });
});
router.get('/covidcare', function (req, res) {
    const userId = req.session.userId;
    Product.find({ category: "covid-care" }, (err, products) => {
        res.render('covidcare', {
            user: userId,
            products: products
        });
    });
});
router.get('/devices', function (req, res) {
    const userId = req.session.userId;
    Product.find({ category: "devices" }, (err, products) => {
        res.render('devices', {
            user: userId,
            products: products
        });
    });
});
router.get('/healthcare', function (req, res) {
    const userId = req.session.userId;
    Product.find({ category: "healthcare" }, (err, products) => {
        res.render('healthcare', {
            user: userId,
            products: products
        });
    });
});
router.get('/medicines', function (req, res) {
    const userId = req.session.userId;

    Product.find({ category: "medicine" }, (err, products) => {
        res.render('medicines', {
            user: userId,
            products: products
        });
    });
});

module.exports = router;