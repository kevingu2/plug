/**
 * Created by kevingu on 4/8/16.
 */
var User     = require('../models/User');
var express = require('express');
var router = express.Router();
var AuthMiddleWare = require('./../util/AuthMiddleware.js');
var AuthenticationFactory = require('../util/AuthenticationFactory.js');
var Constants = require('../util/Constants.js');

router.get('/', AuthMiddleWare.isAuthorized, function(req, res) {
    res.json({
        status: Constants.status.SUCCESS,
        data:req.user
    });
});

router.post('/', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        } else {
            if (user) {
                return res.json({
                    status: Constants.status.FAIL,
                    message: Constants.failedMessages.USERNAME_TAKEN
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    if(err)
                        return res.json({
                            status: Constants.status.ERROR,
                            message: err.message
                        });
                    AuthenticationFactory.generateToken(user._id, function(err, token){
                        if(err) {
                            return res.json({
                                status: Constants.status.ERROR,
                                message: err.message
                            });
                        }
                        return res.json({
                            status: Constants.status.SUCCESS,
                            data:token
                        });
                    });
                });
            }
        }
    });
});

module.exports = router;