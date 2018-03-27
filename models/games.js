const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema ({
    sport:          String,
    address:        String,
    date:           Date,
    time:           Number,
    maxPlayers:     Number,
    currentPlayers: Number,
    //referring to user obj (ref:'User')
    owner:          { type: Schema.Types.ObjectId,
                      required: true}
    });

const Games = mongoose.model('Games', gameSchema);
module.exports = Games;