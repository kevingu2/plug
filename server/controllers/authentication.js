/**
 * Created by kevingu on 4/8/16.
 */
var User     = require('../models/User');
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');
var AuthenticationFactory = require('../util/AuthenticationFactory.js');

router.post('/', function(req, res){
    User.findOne({email: req.body.email}, function(err, user) {
        if(!user || !req.body.password)
            return res.json({
                status: Constants.status.FAIL,
                message: Constants.failedMessages.INCORRECT_PASSWORD_USERNAME
            })
        if(!user.validPassword(req.body.password))
            return res.json({
                status: Constants.status.FAIL,
                message: Constants.failedMessages.INCORRECT_PASSWORD_USERNAME
            });
        if (err) {
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        } else {
            AuthenticationFactory.generateToken(user._id, function(err, token){
                if(err) return res.json({
                    status: Constants.status.ERROR,
                    message: err.message
                });
                return res.json({
                    status: Constants.status.SUCCESS,
                    data:token
                });
            });
        }
    });
});

//TODO: delete
router.delete('/', function(req, res){

});

module.exports = router;