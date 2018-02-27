const express = require('express');
const Games = require('../models/games');
const newGameRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');


// GET routes display something to user (=> they get the views)
// POST routes get the information from user and save it to the DB

// res.redirect => has "/"
// res.render => doesn't have "/" and it just takes us to the file (physical address)

//   localhost:3000/newgame
newGameRoutes.get('/newgame', ensureLogin.ensureLoggedIn(), (req,res) => {
    // user is the variable i'm using in my ejs file
    // req.user is currently logged in user
    res.render("games/newgame", {user: req.user});
});

newGameRoutes.post('/newgame', (req,res,next) => {

    // create a new game using Games model
    const newGame = new Games({
        sport : req.body.sport,
        address : req.body.address,
        dateAndTime : req.body.date,
        maxPlayers : req.body.maxPlayers,
        currentPlayers : req.body.currentPlayers,
        owner: req.user._id
    })
// save the new game into the DB
     newGame.save((err) => {
     if(err){
        res.render("/newgame", {user: req.user});
     }
     res.redirect('/homepage');
    }) 
});

newGameRoutes.get('', (req, res, next) => {

})

newGameRoutes.get('/games/:id/edit', ensureLogin.ensureLoggedIn(),(req,res,next) => {
    // console.log('poom');

    const gameId = req.params.id;
    Games.findById (gameId, (err, theGame) => {
        if (err)        {
            return next(err)
        }
        res.render("games/editgame", {
            theGame: theGame
        })
    })
});

newGameRoutes.post('/games/:id', (req,res,next) => {
    console.log('we out here')
    const updates = {
        sport : req.body.sport,
        address : req.body.address,
        maxPlayers : req.body.maxPlayers,
    }
    Games.findByIdAndUpdate(req.params.id, updates, (err) => {
        if (err)        {
            return next(err)
        }
        res.redirect('/homepage');
        // return res.send("test");
    });
});

// delete
newGameRoutes.post('/games/:id/delete', (req, res, next) => {
    const gameId = req.params.id;
    res.redirect('/homepage');

    Games.findByIdAndRemove(gameId, (err) => {
        if (err) {
            return next(err)
        }
        console.log("-------------------")
    })
})




module.exports = newGameRoutes;