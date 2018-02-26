var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session')
const passport = require ('passport');

const MongoStore  = require ('connect-mongo')(session);
const flash = require('connect-flash');


const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require ('bcrypt')

mongoose.connect('mongodb://localhost:27017/pickup-development')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'pickupdev',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore( {mongooseConnection: mongoose.connection})
  })
);

app.use(flash());

//Helps keep amount of data in session as small as we need
passport.serializeUser((user, cb) => {
  cb(null, user._id);
})
//Helps keep amount of data in session as small as we need
passport.deserializeUser((is, cb) => {
  User.findOne({"_id": id}, (err,user) => {
    cb(null,user);
  });
});
//defines whic strategy we are going to use, and its config
passport.use(new LocalStrategy((username, password, next) => {
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
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
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
