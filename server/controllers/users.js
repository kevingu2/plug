/**
 * Created by kevingu on 4/8/16.
 */
var User     = require('../models/User');
var express = require('express');
var router = express.Router();
var AuthMiddleWare = require('./../util/AuthMiddleware.js');
var AuthenticationFactory = require('../util/AuthenticationFactory.js');
var Constants = require('../util/Constants.js');

/**
 * @api {get} /users/ Get User Account
 * @apiGroup Users
 * @apiName Get User
 *
 * @apiHeader {String} Authorization "Bearer "+token.
 * @apiHeaderExample {json} Header:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkQXQiOiIyMDE2LTA1LTA3VDIyOjM5OjQ1LjkwNloiLCJleHBEYXRlIjoiMjAxNi0wNS0wOFQxNToxOTo0NS44NTBaIiwidXNlcklkIjoiNTcxYjFmN2I2MmRlODgyMDU3MDE4Nzg2IiwiX2lkIjoiNTcyZTZlYjE0NzZlMjQ3YzdmZGUzOGI4In0.5mun3hgm73UuYYXhKZ8f3YKwDPc1gR3I09Q_8DNV"
 *     }
 *
 * @apiSampleRequest http://plug-mobile.herokuapp.com/api/users
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": "Success",
 *          "data":{
 *              "_id": "571b1f7b62de882057018786" ,
 *              "email" : "test@yahoo.com" ,
 *              "__v" : 0
 *          }
 *     }
 *
 * @apiError UsernameTaken The username has already been taken
 *
 * @apiErrorExample Fail-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Fail",
 *       "message": "Incorrect email/password";
 *     }
 *
 */
router.get('/', AuthMiddleWare.isAuthorized, function(req, res) {
    res.json({
        status: Constants.status.SUCCESS,
        data:req.user
    });
});

/**
 * @api {post} /users/ Create User Account
 * @apiGroup Users
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
router.post('/', function(req, res) {
    var last_name = req.body.last_name;
    var first_name = req.body.first_name;
    if(!last_name || !first_name){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }
    User.findOne({email: req.body.email}, function(err, user) {
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
                userModel.last_name = last_name;
                userModel.first_name = first_name;
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


/**
 * @api {post} /users/friends AddFriends
 * @apiGroup Users
 * @apiName Add Friends
 *
 * @apiHeader {String} Authorization "Bearer "+token.
 *
 * @apiParam {String[]} friends Array of friend_ids to add
 *
 * @apiHeaderExample {json} Header:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkQXQiOiIyMDE2LTA1LTA3VDIyOjM5OjQ1LjkwNloiLCJleHBEYXRlIjoiMjAxNi0wNS0wOFQxNToxOTo0NS44NTBaIiwidXNlcklkIjoiNTcxYjFmN2I2MmRlODgyMDU3MDE4Nzg2IiwiX2lkIjoiNTcyZTZlYjE0NzZlMjQ3YzdmZGUzOGI4In0.5mun3hgm73UuYYXhKZ8f3YKwDPc1gR3I09Q_8DNV"
 *     }
 *
 * @apiSampleRequest localhost:3000/api/users/friends
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": "Success",
 *          "data": "OK"
 *     }
 *
 * @apiError UsernameTaken The username has already been taken
 *
 * @apiErrorExample Fail-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Fail",
 *       "message": "Missing Fields";
 *     }
 *
 */
router.post('/friends', AuthMiddleWare.isAuthorized, function(req, res) {
    try {
        var friendIds = JSON.parse(req.body.friends);
    }catch(e){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.INCORRECT_TYPE
        });
    }
    var user = req.user;
    if(!friendIds){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }

    //TODO: need check if already added those ids
    for(var i in friendIds){
        user.friends.push(friendIds[i]);
    }
    user.save(function(err){
        if (err) {
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        }else{
            return res.json({
                status: Constants.status.SUCCESS,
                data: Constants.successMessages.OK
            });
        }
    });
});

module.exports = router;