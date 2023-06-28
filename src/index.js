const express = require('express'); 
const app = express();
const mongoose = require("mongoose");             
const port = 4000;  
require("dotenv").config(); 
app.set('view engine', 'ejs')
const path = require("path");
const createError = require('http-errors');
const cookieParser = require("cookie-parser");
const livereload= require('livereload');
const connectLiveReload= require('connect-livereload');
const moment = require('moment');
const flash = require('connect-flash');
app.set("views", path.join(__dirname, "views"));
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true,});
const session = require('express-session')
const MongoDBSession= require('connect-mongodb-session')(session)
// const engine = require('ejs-locals');
// app.engine('ejs', engine);

// const flash= require('connect-flash');
app.use(cookieParser());
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())


app.use(flash());

const store= new MongoDBSession({
    uri:process.env.MONGO_URI,
    Collection:"DocPatSessions"
})

const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
    store:store
}));

// const liveReloadServer = livereload.createServer();
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

// app.use(connectLiveReload());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use((req, res, next)=> {
    if (req.path='/Auth/loginPage') {
        console.log('read the index url')
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }
    next();
  });


  app.all('/express-flash', (req, res)=>  {
    req.flash('success', 'This is a flash message using the express-flash module.');
    res.redirect(301, '/');
  });


app.use('/', require('./routes'));



if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
}




app.listen(port, () => {              
    console.log(`Now listening on port ${port}`);      
});  