/**
 * Created by kevingu on 4/22/16.
 */

var Token = require('../models/Token');
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');

function generateToken(userId, callback) {
    var tokenModel = new Token();
    tokenModel.userId = userId;
    tokenModel.expDate = defaultExpDate(Date.now());
    tokenModel.createdAt = Date.now();
    tokenModel.value = jwt.sign(tokenModel, config.secret, {expiresIn: 60});
    tokenModel.save(function (err, token) {
        if (err) return callback(new Error(err.message), null);
        return callback(null, token);
    });
}


function defaultExpDate(date){
    var EXPTIME = 1000 * 60;
    return date+EXPTIME;
}
exports.generateToken = generateToken