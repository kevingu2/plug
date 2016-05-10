/**
 * Created by kevingu on 5/7/16.
 */
/**
 * Created by kevingu on 5/3/16.
 */
/**
 * Created by kevingu on 4/19/16.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var AccessTokenRequestSchema   = new mongoose.Schema({
    _user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true},

});

// Export the Mongoose model
module.exports = mongoose.model('AccessTokenRequest', AccessTokenRequestSchema);