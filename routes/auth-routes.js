const express = require('express');
const authRoutes = express.Router();
const User = require('../models/user');
const Games = require('../models/games');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require ('passport');
const ensureLogin = require('connect-ensure-login');
//display signup form
authRoutes.get('/signup', (req,res,next) => {
    res.render('auth/signup');
});
//submit signup form
authRoutes.post('/signup', (req,res,next) => {
    // picking up the value of input field with name "username"
    const username = req.body.username;
    // picking up the value of input field with name "password"
    const password = req.body.password;

// no empty fields when signup
    if (username === "" || password === "") {
        // if user wants to submit form and didn't fill all the fields, render signup form again
        res.render('auth/signup', {message: 'Indicate username and password'});
        return;
    }
    User.findOne({username}, "username", (err,user) => {
        // check if username is available (no duplikates allowed in DB)
        if (user !== null) {
            res.render('auth/signup', { message: "The username already exists"});
            return
        }
        // password encryption
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password,salt);
// create new user with unique username and scrambled password  
        const newUser = new User({
            username,
            password: hashPass
        });
// save new user in DB
        newUser.save((err) => {
            // if there's an error, must be coming from DB, sorry, render the form again 
            if (err) {
                res.render('auth/signup', {message: "Something went wrong"});
            } else {
                // if everything is OK, after saving, go to HOME page
                res.redirect('/');
            }
        });
    });
});
//GET loads the view we will use
authRoutes.get('/login', (req,res,next) => {
    res.render('auth/login', {"message": req.flash("error") });
});

//POST will contain the passport functionality
authRoutes.post('/login', passport.authenticate("local", {
    successRedirect: "/homepage",
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}));

authRoutes.get('/homepage', (req, res, next) => {
    // this Games comes from where we defined it earlier (requiring the Game Model)
    Games
    .find({})

    // save the results as "gameResults"
    .exec((err,gameResults) => {
        // when redering "home", pass along the data of gameResults
        res.render('home', {user: req.user, gameResults});
        // console.log("gameResults: ====", gameResults)
    });
});


authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = authRoutes;