/**
 * Created by kevingu on 4/8/16.
 */
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');
var Token = require('../models/Token');
var User = require('../models/User');
var Constants = require('../util/Constants.js');

function ensureAuthorized(){
    return function (req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            if(typeof bearerToken ==='undefined') res.sendStatus(403);
            Token.findOne({value:bearerToken}, function(err, token){
                if(err) return res.json({error:err.message});
                try {
                    jwt.verify(bearerToken, config.secret, function(err, _){
                        if(err) return res.json({type: false, msg: err.message});
                        if(!token)
                            return res.json({
                                status: Constants.status.FAIL,
                                msg: Constants.failedMessages.NO_TOKEN
                            });
                        console.log("token expiration date: "+token.expDate);
                        console.log("current date: "+new Date());
                        if(token.expDate < new Date()){
                            Token.remove({_id:token._id}, function(err){
                                return res.json({
                                    status: Constants.status.FAIL,
                                    error: Constants.failedMessages.TOKEN_EXPIRED
                                });
                            });
                        }else {
                            User.findOne({_id:token.userId}, { password: 0}, function(err, user) {
                                console.log(user);
                                if (err) {
                                    return res.json({
                                        status: Constants.status.ERROR,
                                        error: err
                                    });
                                } else {
                                    req.user = user;
                                    next();
                                }
                            });
                        }
                    });
                }catch(err){
                    return res.json({
                        status: Constants.status.ERROR,
                        error: err.message
                    });
                }
            });
        } else {
            return res.sendStatus(403);
        }
    }
}

exports.isAuthorized=ensureAuthorized();