const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema ({
    sport:          String,
    address:        String,
    date:           Date,
    time:           Number,
    maxPlayers:     Number,
    currentPlayers: {
        type: Number,
        default: 1
    },
    owner:          { type: Schema.Types.ObjectId,
                      required: true}
    });

const Games = mongoose.model('Games', gameSchema);
module.exports = Games;