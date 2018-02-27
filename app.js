const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const session = require('express-session')
const passport = require ('passport');

const MongoStore  = require ('connect-mongo')(session);
const flash = require('connect-flash');


const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require ('bcrypt')

mongoose.connect('mongodb://localhost:27017/pickup-development')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use( (req, res, next) => {
  if (typeof(req.user) !== "undefined"){
    res.locals.userSignedIn = true;
  } else {
    res.locals.userSignedIn = false;
  }
  next();
});

app.use(session({
  secret: 'pickupdev',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( {mongooseConnection: mongoose.connection})
  })
);

//Helps keep amount of data in session as small as we need
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
//Helps keep amount of data in session as small as we need
passport.deserializeUser((id, cb) => {
  User.findOne({"_id": id}, (err,user) => {
    if (err) {return cb(err);}
    cb(null,user);
  });
});
//used to manage flash errors if username/password is incorrect
app.use(flash());
//defines whic strategy we are going to use, and its config
passport.use(new LocalStrategy({
  passReqToCallback: true},
  (req,username, password, next) => {
  User.findOne({username}, (err,user) => {
    if(err) {
      return next (err);
    }
    if (!user) {
      return next (null, false, {message: "Incorrect username"});
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {message: "Incorrect password"});
    }
    return next(null,user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/auth-routes');
const index = require('./routes/index');
const users = require('./routes/users');
const newGamesRoute = require('./routes/newgame-route');
app.use('/', newGamesRoute);
// app.use('/', index);
app.use('/users', users);
app.use('/', authRoutes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
