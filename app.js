const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRoutes =  require('./routes/authRoutes')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://fidelniyomugabo67:admin@cluster0.slqgylr.mongodb.net/miss';
mongoose.connect(dbURI, {
  // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true 
  
  })
  .then((result) => {
  console.log('conected to db')
  app.listen(3000,()=>{
    console.log('on port 3000')
  })
  })
  .catch((err) => console.log(err));

// routes
 app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)


// // cookies 

// app.get('/cookies', (req, res)=>{

//   // res.setHeader('set-Cookie', 'NewUser = true')
//   res.cookie('newCookies', false , {maxAge: 1000 * 10 , secure: true})
//   res.cookie('user', false)
//   res.send('hell')

// })
// app.get('/get-cookies', (req, res)=>{
  
//   const cookies = req.cookies
//   res.json(cookies)
// })