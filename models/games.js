const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema ({
    sport:          String,
    address:        String,
    date:           String,
    time:           String,
    maxPlayers:     Number,
    currentPlayers: Number
});

const Games = mongoose.model('Games', gameSchema);
module.exports = Games;