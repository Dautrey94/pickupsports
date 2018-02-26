const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema ({
    sport:          String,
    address:        String,
    dateAndTime:    Date,
    maxPlayers:     Number,
    currentPlayers: Number,
    owner:          { type: Schema.Types.ObjectId,
                      required: true}
    });

const Games = mongoose.model('Games', gameSchema);
module.exports = Games;