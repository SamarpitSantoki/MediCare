const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');

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
        res.redirect('/home')
    }else{
        next()
    }
}

// Routes
router.get('/', function(req,res){
    const { userId } = req.session;
    res.send(`<h1>Welcome</h1>

    ${
        userId ? `<form method='POST' action='/logout'><button>Logout</button><a href='/home'>Home</a> </form>` : `<a href='/register'>Register</a></br><a href='/login'>Login</a>`
    }`)
});

router.get('/register',redirectHome, (req,res)=>{
     res.send(`
    <h1>Register</h1>
        <form method='post' action='/register'>
            <input name='name' placeholder='Name' required />
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <input type='submit' />
        </form>
    <a href='/login'>Login</a>
    `)
})

router.get('/home',redirectLogin, async (req,res)=>{
    // create user and set its id element same as session userId(IT WILL HELP TO DISPLAY USER VALUE)
    // have to use await else code will run before creating user
    try{
        const user = await User.findOne({ id:req.session.userId });
        
        res.send(`
        <h1>Home</h1>  
        <a href='/'>Main</a>
        <ul>
            <li> Name : ${user.name}</li>
            <li> Email : ${user.email}</li>
            
            ${req.session.userId}
        </ul>   
        `)
    }catch(error){
        console.log(error);
    }
});

router.get('/login',redirectHome, (req,res)=>{
    res.send(`
        <h1>Login</h1>
        <form method='post' action='/login'>
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <input type='submit' />
        </form>
        <a href='/register'>Register</a>
    `)
})

router.post('/register', async (req,res)=>{
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
           return res.redirect('/home');
       }
   }
   res.redirect('/register');
})

router.post('/login', async (req,res)=>{
    const { email , password } = req.body;

    if(email && password ) {
        // authentication
        const user = await User.findOne({ email:email,password:password });
        console.log(user);
        if (user) {
            req.session.userId = user.id;
            return res.redirect('/home');
        }
    }res.redirect('/login');
})

router.post('/logout',redirectLogin, (req,res)=>{
    req.session.destroy(err => {
        if(err){
            res.redirect('/home');
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})


module.exports = router;