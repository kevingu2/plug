/**
 * Created by kevingu on 5/13/16.
 */
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: 'SdJpeiLN3kZN7QEtjtucc4ucY',
    consumerSecret: 'pFDtN0w81st6UJm1Qe3KsJ6xzlKqFeIIFMJGkt1YtddnV6SzMv',
    callback: 'http://mighty-garden-34454.herokuapp.com/landing_page'
});


router.get('/authorize_user', function(req, res) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {
            console.log("Error getting OAuth request token : " + error.msg);
        } else {
            console.log("request token: "+requestToken);
            console.log("request token secret: "+requestTokenSecret);
        }
    });
});

module.exports = router;