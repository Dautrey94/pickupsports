const express = require('express');
const Games = require('../models/games');
const newGameRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');

newGameRoutes.get('/newgame', ensureLogin.ensureLoggedIn(), (req,res) => {
    // user is the variable i'm using in my ejs file
    // req.user is currently logged in user
    res.render("games/newgame", {user: req.user});
});
newGameRoutes.post('/newgame', (req,res,next) => {
    const newGame = new Games({
        sport : req.body.sport,
        address : req.body.address,
        dateAndTime : req.body.date,
        maxPlayers : req.body.maxPlayers,
        currentPlayers : req.body.currentPlayers,
        owner: req.user._id
    })

     newGame.save((err) => {
     if(err){
        res.render("/newgame", {user: req.user});
     }
     res.redirect('/homepage');
    }) 
});

module.exports = newGameRoutes;