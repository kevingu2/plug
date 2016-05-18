/**
 * Created by kevingu on 5/5/16.
 */
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');
var AuthMiddleWare = require('./../util/AuthMiddleware.js');
var SocialMediaRequest = require('../models/SocialMediaRequest');
var AccessTokenRequest = require('../models/AccessTokenRequest');
var request = require('request');

router.post('/hardFollow', function(req, res){
    var instagram_url = 'https://api.instagram.com/v1/users/3198079023/relationship?access_token=3113239738.df4ad03.0c5a8fa68f6a4b72a330032d2844ffac';
    request.post(instagram_url, {form: {action: 'follow'}}, function (err, httpResponse, body) {
        if(err)
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        else{
            return res.json({
                status: Constants.status.SUCCESS,
                message: Constants.successMessages.OK
            });
        }
    });
});

router.post('/', AuthMiddleWare.isAuthorized, function (req, res) {
    var self_id = req.user._id;
    var target_id  = req.body.target_id;
    var instagram_access_token = req.body.instagram_access_token;

    if(!self_id || !target_id || !instagram_access_token){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }
    //TODO: check if this friend request was made already
    var socialMediaRequest = new  SocialMediaRequest();
    socialMediaRequest._self_user = self_id;
    socialMediaRequest._target_user = target_id;
    socialMediaRequest.instagram_access_token = instagram_access_token;
    socialMediaRequest.isApproved = false;
    socialMediaRequest.save(function(err){
       if(err){
           return res.json({
               status: Constants.status.ERROR,
               message: err.message
           });
       }else{
           return res.json({
               status: Constants.status.SUCCESS,
               message: Constants.successMessages.OK
           });
       }

    });
});

router.get('/', AuthMiddleWare.isAuthorized, function (req, res) {
    var self_id = req.user._id;
    if(!self_id){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }
    SocialMediaRequest.find({_target_user:self_id}, {instagram_access_token:0}).exec(function(err, requests){
       if(err)
           return res.json({
               status: Constants.status.ERROR,
               message: err.message
           });
        return res.json({
            status: Constants.status.SUCCESS,
            data: requests
        });
    });
});

//TODO: change follow to a param for delete also
router.post('/:request_id/follow', AuthMiddleWare.isAuthorized, function (req, res) {
    var social_media_request_id = req.params.request_id;
    var instagram_id = req.body.instagram_id;
    if(!social_media_request_id ){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }
    SocialMediaRequest.findOne({_id:social_media_request_id}).exec(function(err, smRequest){
        if(err)
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        else if(!smRequest)
            return res.json({
                status: Constants.status.FAIL,
                message: Constants.failedMessages.CAN_NOT_FIND_ID
            });
        var instagram_url = 'https://api.instagram.com/v1/users/'+instagram_id+'/relationship?access_token='+smRequest.instagram_access_token;
        request.post(instagram_url, {form:{action:'follow'}}, function (err, httpResponse, body){
            if(err)
               return res.json({
                   status: Constants.status.ERROR,
                   message: err.message
               });
            //TODO: if oauth exception then put it into another table to retrieve new access code from user
            console.log(body);
            var json_body = JSON.parse(body);
            if('error_type' in json_body['meta']) {
                AccessTokenRequest.findOne({_user:smRequest.self_user}, function (err, atRequest) {
                    if (err)
                        return res.json({
                            status: Constants.status.ERROR,
                            message: err.message
                        });
                    if (!atRequest){
                        var accessTokenRequest = new AccessTokenRequest();
                        accessTokenRequest._user = smRequest._self_user;
                        accessTokenRequest.save(function(err){
                            if(err) console.log(err.message);
                        });
                    }
                    console.log("YESSSSSS");
                    smRequest.isApproved = true;
                    smRequest.target_user_instagram_id = instagram_id;
                    smRequest.save(function(err){
                        if (err)
                            return res.json({
                                status: Constants.status.ERROR,
                                message: err.message
                            });
                        return res.json({
                            status: Constants.status.SUCCESS,
                            data: Constants.failedMessages.WRONG_ACCESS_TOKEN
                        });
                    });
                });
            }else if('code' in json_body['meta'] && json_body['meta']['code'] === 200){
                smRequest.remove(function(err){
                    if(err)
                        return res.json({
                            status: Constants.status.ERROR,
                            message: err.message
                        });
                    return res.json({
                        status: Constants.status.SUCCESS,
                        data: Constants.successMessages.OK
                    });
                });
            }else {
                return res.json({
                    status: Constants.status.FAIL,
                    message: "No Instagram message"
                });
            }
        });

    });
});

router.put('/', AuthMiddleWare.isAuthorized, function (req, res){
    var access_token = req.body.access_token;
    var self_id = req.user._id;
    SocialMediaRequest.find({_self_user:self_id}, function(err, smRequest){
        if(err) {
           return res.json({
               status: Constants.status.ERROR,
               message: err.message
           });
        }
        var numRequest = 0;
        for (var i in smRequest){
           if(smRequest[i].isApproved)
            numRequest++;
        }
        if(numRequest == 0){
            if (numRequest == 0) {
                return res.json({
                    status: Constants.status.SUCCESS,
                    data: Constants.successMessages.OK
                });
            }
        }

        for(var i in smRequest){
            if(smRequest[i].isApproved) {
               var instagram_url = 'https://api.instagram.com/v1/users/' + smRequest[i].target_user_instagram_id + '/relationship?access_token=' + access_token;
               request.post(instagram_url, {form: {action: 'follow'}}, function (err, httpResponse, body) {
                   if (err) {
                       return res.json({
                           status: Constants.status.ERROR,
                           message: err.message
                       });
                   }
                   var json_body = JSON.parse(body);
                   if('error_type' in json_body['meta']) {
                       return res.json({
                           status: Constants.status.FAIL,
                           message: Constants.failedMessages.WRONG_ACCESS_TOKEN
                       });
                   }else if('code' in json_body['meta'] && json_body['meta']['code'] === 200){
                       smRequest[i].remove(function (err) {
                           if (err)
                               return res.json({
                                   status: Constants.status.ERROR,
                                   message: err.message
                               });
                           numRequest--;
                           if (numRequest == 0) {
                               return res.json({
                                   status: Constants.status.SUCCESS,
                                   data: Constants.successMessages.OK
                               });
                           }
                       });
                   }
               });
            }
        }
    });
});


module.exports = router;