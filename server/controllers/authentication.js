/**
 * Created by kevingu on 4/8/16.
 */
var User     = require('../models/User');
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');
var AuthenticationFactory = require('../util/AuthenticationFactory.js');
var Token = require('../models/Token');

/**
 * @api {post} /users/ Create Token
 * @apiGroup Tokens
 * @apiName Create User
 *
 * @apiParam {String} email        Mandatory email.
 * @apiParam {String} password     Mandatory password.
 *
 * @apiSuccess {String} status Success
 * @apiSuccess {String} data Token
 *
 * @apiSampleRequest http://plug-mobile.herokuapp.com/api/users
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Success",
 *       "data": {
 *          "_id" :
 *          "value" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NzFiMWY3YjYyZGU4ODIwNTcwMTg3ODYiLCJfaWQiOiI1NzFjODUyNmEwN2FkNTI0ODNiNjE4ZjUiLCJjcmVhdGVkQXQiOiIyMDE2LTA0LTI0VDA4OjM0OjMzLjQwMVoiLCJleHBEYXRlIjoiMjAxNi0wNC0yNFQwODozNTozMy40MDFaIn0.4AaTa9OvANdwYa-kz_ZuqyXY_B2T10fbIC5I3cNQ5f4" ,
 *          "userId" : "571b1f7b62de882057018786" ,
 *          "createdAt" : { "$date" : "2016-04-24T08:34:33.401Z"} ,
 *          "expDate" : { "$date" : "2016-04-24T08:35:33.401Z"} ,
 *          "__v" : 0
 *       }
 *     }
 *
 * @apiError UsernameTaken The username has already been taken
 *
 * @apiErrorExample Fail-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Fail",
 *       "message": "User already exists";
 *     }
 *
 */
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

router.delete('/', function(req, res){
    var id = req.body.id;
    Token.remove({_id:id}, function(err){
        if(err) return res.json({
            status: Constants.status.ERROR,
            message: err.message
        });
        return res.json({
            status: Constants.status.SUCCESS,
            data: Constants.successMessages.OK
        });
    });
});

module.exports = router;