const express = require("express");
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const Product = require('../model/productSchema');
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

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/')
    } else {
        next()
    }
}


router.get("/add/:product", (req, res) => {

    const slug = req.params.product;

    Product.findOne({ slug: slug }, (err, p) => {
        if (err) {
            console.log(err);
        }
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: p.title,
                slug: slug,
                qty: 1,
                price: parseInt(p.price),
                total: parseInt(p.price),
                image: '/product_images/' + p._id + '/' + p.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title === slug) {
                    cart[i].qty++;
                    cart[i].total = cart[i].price * cart[i].qty;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseInt(p.price),
                    total: parseInt(p.price),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
        }
        console.log(req.session.cart);
        res.redirect('back');
    });
});

router.get('/', (req, res) => {

    var total = 0;
    var cart = req.session.cart;
    for (var i = 0; i < cart.length; i++) {
        total += parseInt(cart[i].total);
    }
    if(cart && cart.length==0){
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
    res.render('cart', {
        title: 'Checkout',
        cart: cart,
        total: total,
        user: req.session.userId
    });
}
});

router.get('/update/:product', (req, res) => {

    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    cart[i].total = cart[i].price * cart[i].qty;
                    break;
                case "remove":
                    cart[i].qty--;
                    cart[i].total = cart[i].price * cart[i].qty;
                    if (cart[i].qty < 1) cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;

                default:
                    console.log("Update Problem");
                    break;
            }
            break;
        }
    }
    res.redirect('back');
});

router.get('/clear',(req,res)=>{

    delete req.session.cart;
    res.redirect('/cart/checkout');
});

module.exports = router;
