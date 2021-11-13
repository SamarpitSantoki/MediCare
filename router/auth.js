const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

require('../config/db');
const User = require('../model/userSchema');

const SESS_SECRET = process.env.SESS_secret; //will run when page is loaded first time
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

// function for redirecting to home if user logged in
const redirectHome = (req,res,next) => {
    if (req.session.userId){
        res.redirect('/')
    }else{
        next()
    }
}

// app.use(async (req, res , next) => {
//     const { userId } = req.session;
//     if(userId) {
//         res.locals.userid = await User.findOne({id:userId});
//     }
//     next();
// })

// Routes
router.get('/', function(req,res){
    const userId =  req.session.userId;
    res.render('home',{
        user : userId,
    })
});

router.get('/signup',redirectHome, (req,res)=>{
    res.render('signup');
})

// router.get('/home',redirectLogin, async (req,res)=>{
//     // create user and set its id element same as session userId(IT WILL HELP TO DISPLAY USER VALUE)
//     // have to use await else code will run before creating user
//     try{
//         const user = await User.findOne({ id:req.session.userId });
        
//         res.send(`
//         <h1>Home</h1>  
//         <a href='/'>Main</a>
//         <ul>
//             <li> Name : ${user.name}</li>
//             <li> Email : ${user.email}</li>
            
//             ${req.session.userId}
//         </ul>   
//         `)
//     }catch(error){
//         console.log(error);
//     }
// });

router.get('/login',redirectHome, (req,res)=>{
    res.render('login');
})

router.post('/signup', async (req,res)=>{
   let active_ids = await User.countDocuments({}) + 1;
   const { name, email , password } = req.body;
   //check all fields are filled
   if(name && email && password){
       // to check if user already exists
       const exists = User.findOne({email:email});
       if(exists){  
           const user = new User({
               id : active_ids++,
               name,
               email,
               password
           });
           
           user.save().then(() => console.log("User Registered.")).catch(()=>console.log('User not created'));
           req.session.userId = user.id;
           console.log(req.session);
           return res.redirect('/');
       }
   }
   res.redirect('/signup');
})

router.post('/login', async (req,res)=>{
    const { email , password } = req.body;

    if(email && password ) {
        // authentication
        const user = await User.findOne({ email:email,password:password });
        console.log(user);
        if (user) {
            req.session.userId = user.id;
            return res.redirect('/');
        }
    }res.redirect('/login');
})

router.post('/logout',redirectLogin, (req,res)=>{
    req.session.destroy(err => {
        if(err){
            res.redirect('/');
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})


module.exports = router;