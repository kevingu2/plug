/**
 * Created by kevingu on 5/5/16.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var SocialMediaRequestSchema   = new mongoose.Schema({
    _target_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    instagram_access_token: {type:String},
    _self_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    target_user_instagram_id: {type:String},
    isApproved: {type: Boolean, required:true}
});

// Export the Mongoose model
module.exports = mongoose.model('SocialMediaRequest', SocialMediaRequestSchema);