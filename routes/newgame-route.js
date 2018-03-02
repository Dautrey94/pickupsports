const express = require('express');
const Games = require('../models/games');
const User = require('../models/user');
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
        owner: req.user._id,
    })
// save the new game into the DB
     newGame.save((err) => {
     if(err){
        res.render("/newgame", {user: req.user});
     }
     res.redirect('/homepage');
    }) 
});

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

//Join Game
;

newGameRoutes.post('/games/:id/add', ensureLogin.ensureLoggedIn(),(req,res,next) => {
    const gameId = req.params.id;
// find a user by his id 
// (req.user is available because we are currently logged in)
//     |
//      ------------
//                  | (and theUser is just a placeholder, can be any name, we just ahve to be cosinstent)
//                  |       |
//                  |       ------------
//                  |                  | 
    User.findById(req.user._id, (err, theUser) => {
        // we are changing the status of our user 
        //from not in a game (set to false) to in the game (set to true)
        theUser.inTheGame = true;
        // saving user's chaniges into DB
        theUser.save((err) => {
            if (err) {
                console.log("err is:", err)
                return next(err)
            }
            // finding the game by id
            // theGame is just a placeholder, can be anything, just stay consistent
            Games.findById(gameId, (err, theGame) => {
                // console.log('theGame')
                if (err) {
                    console.log("err is:", err)
                    return next(err)
                }
                // check if there's any left places in the game for user's to join
                if(theGame.maxPlayers > theGame.currentPlayers){
                    // if thats true, add a player
                    theGame.currentPlayers+=1;
                }
                // save the changes for that game
                theGame.save((err)=>{
                    if (err) {
                        console.log("err is:", err)
                        return next(err)
                    } 
                })
                // go to a homepage
                res.redirect('/homepage')
            })
     })
 })
});

newGameRoutes.post('/games/:id/leave', (req, res, next) =>{
    const gameId = req.params.id;
    User.findById(req.user._id, (err, theUser) =>{
        theUser.inTheGame = false;
        theUser.save((err) => {
            if (err) {
                console.log("err is:", err)
                return next(err)
            } 

            Games.findById(gameId, (err, theGame) => {
                theGame.currentPlayers-=1;
                theGame.save((err)=>{
                    if (err) {
                        console.log("err is:", err)
                        return next(err)
                    } 
                })
            })
            res.redirect('/homepage')
        })
    })

})



// newGameRoutes.post('/games/:id/',(req,res,next) => {
//     console.log('yoo');
//     const addPlayer = {
//         currentPlayers: req.body.currentPlayers
//     }
//     Games.findByIdAndUpdate (req.params.id, addPlayer, (err) => {
//         if (err) {
//             return next (err)
//         }
//         res.redirect('/homepage');
//     });
// });

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



// attempt to disbale join button

// function disableJoin() {
//    document.getElementById("joinBtn").disabled = true;
// }
// if (currentPlayers === maxPlayers){
//     return disableJoin()
// }


module.exports = newGameRoutes;