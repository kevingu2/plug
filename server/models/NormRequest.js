/**
 * Created by kevingu on 5/3/16.
 */
/**
 * Created by kevingu on 4/19/16.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var NormRequestSchema   = new mongoose.Schema({
    _user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date:{type:Date, required:true},
    latitude:{type:Number,required:true},
    longitude:{type:Number, required:true},
});

// Export the Mongoose model
module.exports = mongoose.model('NormRequest', NormRequestSchema);