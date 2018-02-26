const express = require('express');
const authRoutes = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require ('passport');

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
            password: hashpass
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
    res.render('auth/login');
});
//POST will contain the passport functionality
authRoutes.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}));

module.exports = authRoutes;