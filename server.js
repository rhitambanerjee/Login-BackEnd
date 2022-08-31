if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config()
}
const express=require('express');
const bcrypt=require('bcrypt');
const app=express();
const passport=require('passport');
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport=require('./passport-config');
initializePassport(
   passport,
   email => users.find(user => user.email === email),
   id => users.find(user => user.id === id)
)
const users=[];
app.use(express.urlencoded({extended:false}));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.get('/', checkAuthenticated, (req, res) => {
   res.render('index.ejs', { name: req.user.name })
})
 
app.get('/login',checkNotAuthenticated,(req,res)=>{
   res.send('Login Page');
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
}))
 
app.get('/register',checkNotAuthenticated,(req,res)=>{
   res.send('Register Page');
})
app.post('/register',async(req,res)=>{
   try{
      const hashedPassword=await bcrypt.hash(req.body.password,10);
      users.push({
         id:Date.now().toString(),
         name:req.body.name,
         email:req.body.email,
         password:hashedPassword
      })
      res.redirect('/login');
   }catch{
      res.redirect('/register');
   }
})
app.post('/logout', function(req, res, next) {
   req.logout(function(err) {
     if (err){ 
      return next(err); 
   }
     res.redirect('/login');
   })
})
app.delete('/email',(req,res)=>{
   const filteredUsers = users.filter((item) => item.email !== email);
})
function checkAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
     return next()
   }
 
   res.redirect('/login')
 }
function checkNotAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
     return res.redirect('/')
   }
   next()
}
app.listen((5000),()=>{
   console.log('Server is running on port 5000');
})