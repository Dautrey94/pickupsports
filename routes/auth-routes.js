const express = require('express');
const authRoutes = express.Router();
const User = require('../models/user');
const Games = require('../models/games');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require ('passport');
const ensureLogin = require('connect-ensure-login');

authRoutes.get('/signup', (req,res,next) => {
    res.render('auth/signup');
});

authRoutes.post('/signup', (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render('auth/signup', {message: 'Indicate username and password'});
        return;
    }

    User.findOne({username}, "username", (err,user) => {
        if (user !== null) {
            res.render('auth/signup', { message: "The username already exists"});
            return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password,salt);

        const newUser = new User({
            username,
            password: hashPass
        });

        newUser.save((err) => {
            if (err) {
                res.render('auth/signup', {message: "Something went wrong"});
            } else {
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

authRoutes.get('/homepage', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    // this Games comes from where we defined it earlier (requiring the Game Model)
    Games
    .find({})

    // save the results as "gameResults"
    .exec((err,gameResults) => {
        // when redering "home", pass along the data of gameResults
        res.render('home', {user: req.user, gameResults});
    });
});


authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = authRoutes;