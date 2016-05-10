/**
 * Created by kevingu on 5/7/16.
 */
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');
var AuthMiddleWare = require('./../util/AuthMiddleware.js');
var AccessTokenRequest = require('../models/AccessTokenRequest');
router.get('/', AuthMiddleWare.isAuthorized, function (req, res) {
    AccessTokenRequest.findOne({_user: req.user._id}, function(err, atRequest){
        if(err) {
           return res.json({
               status: Constants.status.ERROR,
               message: err.message
           });
        }
        return res.json({
            status: Constants.status.SUCCESS,
            data: atRequest
        });
    });
});

router.delete('/', AuthMiddleWare.isAuthorized, function (req, res) {
    AccessTokenRequest.findOne({_user: req.user._id}, function(err, atRequest){
        if(err) {
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        }
        return res.json({
            status: Constants.status.SUCCESS,
            data: atRequest
        });
    });
});
module.exports = router;