/**
 * Created by kevingu on 5/2/16.
 */
/**
 * Created by kevingu on 4/28/16.
 */

var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');
var api = require('instagram-node').instagram();

api.use({ client_id: 'df4ad03418064321a3051997ed03fe36',
    client_secret: '22fa1d1d67c54091b76a62cceb89d147' });

var redirect_uri = 'https://mighty-garden-34454.herokuapp.com/landing_page';

router.get('/authorize_user', function(req, res) {
    res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes','follower_list', 'relationships'], state: 'a state' }));
});

router.get('/handleauth', function(req, res) {
    api.authorize_user(req.query.code, redirect_uri, function(err, result) {
        if (err) {
            console.log(err.body);
            res.send("Didn't work");
        } else {
            console.log(result);
            console.log('Yay! Access token is ' + result.access_token);
            res.send('You made it!!');
        }
    });
});

router.get('/followUser', function (req, res){
    var ig = require('instagram-node').instagram({});
    ig.use({ access_token: '3198079023.df4ad03.9ebc60f3275c43428d232d85b738ced5' });
    ig.user_follows('3113239738', function(err, users, pagination, remaining, limit) {
        console.log("error: "+err);
        console.log("users: "+users);
        console.log("remaining: "+remaining);
        console.log("limit: "+limit);
        if(!err)
            return res.send("YESSS");
        else
            return res.send("ERROR");
    });
});



module.exports = router;