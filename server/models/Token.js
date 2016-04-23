/**
 * Created by kevingu on 4/19/16.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
    value: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expDate: {type: Date, required: true, default:defaultExpDate(new Date())},
    createdAt: {type: Date, required: true, default:new Date()}
});

// Export the Mongoose model

function defaultExpDate(date){
    var EXPTIME = 1000 * 60;
    return date.setTime(date.getTime() + EXPTIME);
}
module.exports = mongoose.model('Token', TokenSchema);