/**
 * Created by kevingu on 4/19/16.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
    value: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expDate: {type: Date, required: true},
    createdAt: {type: Date, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);