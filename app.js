const express                                  = require('express');
const cookieParser                             = require('cookie-parser');
const mongoose                                 = require('mongoose');
const getjson                                  = require('get-json');
const app                                      = express();
const protected                                = require('./src/routes/verifyAuth');
const userController                           = require('./src/routes/user');
const postController                           = require('./src/routes/post')
require('dotenv').config();

// Set view engine
app.set('view engine', 'ejs');

// MiddleWares
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));

// Routes + Controllers
app.use('/post/', protected, postController);
app.use('/user/', userController);
app.use('/edit_status/', protected, (req,res) => {
  res.render('edit_status', {name: req.user.username});
});
app.use('/post_status/', protected, (req,res) => {
  res.render('post_status', {name: req.user.username});
});
app.use('/login/', (req, res) => {
  if(req.cookies.jwt)return res.redirect('/home');
  res.render('login');
});
app.use('/register/', (req, res) => {
  if(req.cookies.jwt)return res.redirect('/home');
  res.render('register');
});
app.use('/logout/', protected, (req,res) => {
  res.clearCookie('jwt').render('login',{msg:'logged out'});
})

app.use('/home', protected, (req,res) => { // LoggedIn
  const f1 = getjson("https://covid-api.mmediagroup.fr/v1/cases");
  const f2 = getjson("https://animechan.vercel.app/api/random");
  const f3 = req.user.username;
  const f4 = getjson("https://api.adviceslip.com/advice");
  Promise.all([f1, f2, f3,f4]).then((data) => {
    res.render("home", {
      covidstatus         : data[0],
      randomanimequotes   : data[1],
      name                : data[2],
      advice              : data[3],
    });
  }).catch(err => res.render('home',{errorMsg:err}));
});

app.use('/', (req,res) => { // Public
  if(req.cookies.jwt)return res.redirect('/home');
  const f1 = getjson("https://covid-api.mmediagroup.fr/v1/cases");
  const f2 = getjson("https://animechan.vercel.app/api/random");
  const f3 = getjson("https://api.adviceslip.com/advice");
  
  Promise.all([f1, f2, f3]).then((data) => {
    res.render("index", {
      covidstatus         : data[0],
      randomanimequotes   : data[1],
      advice              : data[2],
    });
  }).catch(err => res.render('index',{errorMsg:err}));
});


// Connecting Database .env file must be in root directory
mongoose.connect(process.env.DB_CONNECTION,
{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true, useFindAndModify: false},(err) => {
  if(!err)console.log("MONGOOSE IS SUCCESSFULLY CONNECTED!");
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on PORT: ${port}`));