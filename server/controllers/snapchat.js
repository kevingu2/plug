/**
 * Created by kevingu on 4/28/16.
 */
var Snapchat = require('snapchat')
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');

router.post('/login', function(req, res) {
    var client = new Snapchat()
    client.signIn('yamk5136', 'dragonmaster1', 'kkevingu@gmail.com', 'Dragon1master!', function (err, session) {
        if (!err) {
            console.log('signed in', client.username)
            console.log(session);
            return res.json({
                status: Constants.status.SUCCESS,
                message: "OK"
            });
        }
        else{
            console.log(err);
            return res.json({
                status: Constants.status.ERROR,
                message: "Error"
            });
        }
    });
});

module.exports = router;