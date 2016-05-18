/**
 * Created by kevingu on 5/3/16.
 */
var express = require('express');
var router = express.Router();
var NormRequest = require('../models/NormRequest');
var User = require('../models/User');
var AuthMiddleWare = require('./../util/AuthMiddleware.js');
var Constants = require('../util/Constants.js');
var MAX_DISTANCE = 50;
var TIME_OUT = 50000;

router.post('/', AuthMiddleWare.isAuthorized, function(req, res){
    var userId = req.user._id;
    var date = req.body.date;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    if(!userId || !date || !latitude || !longitude){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }
    var request = new NormRequest();
    request._user = userId;
    request.date = date;
    request.latitude = latitude;
    request.longitude = longitude;
    request.save(function(err){
        if (err) {
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        }
        return res.json({
            status: Constants.status.SUCCESS,
            message: request
        });

    });
});


router.get('/', AuthMiddleWare.isAuthorized, function (req, res){
    var request_id = req.query.request_id;

    if(!request_id){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }

    NormRequest.findOne({_id:request_id}, function(err, userRequest){
        //TODO optimize this to add query for distance
        if (err) {
            return res.json({
                status: Constants.status.ERROR,
                message: err.message
            });
        }
        if(!userRequest){
            return res.json({
                status: Constants.status.FAIL,
                message: Constants.failedMessages.CAN_NOT_FIND_ID
            });
        }
        NormRequest.find({date:{ $lte:userRequest.date+TIME_OUT}}).populate('_user', '-password -friends').exec(function(err, requests){
            if (err) {
                return res.json({
                    status: Constants.status.ERROR,
                    message: err.message
                });
            } else {
                var nearUsers = [];
                for(var i in requests){
                    var r = requests[i];
                    console.log(r._user);
                    var dist = Math.sqrt(Math.pow(r.latitude - userRequest.latitude, 2)+Math.pow(r.longitude - userRequest.longitude, 2));
                    console.log("Dist: "+dist);
                    console.log("request_id: "+request_id);
                    if(r._id != request_id && dist <= MAX_DISTANCE){
                        console.log(r._id);
                        nearUsers.push(r._user);
                    }
                }
            }
            return res.json({
                status: Constants.status.SUCCESS,
                data:{
                    users: nearUsers
                }
            })
        });
    });
});

//TODO: implement delete for requests
router.delete('/:id', AuthMiddleWare.isAuthorized, function (req, res){
    var userId = req.user._id;
    var requestId = req.params.id;
    if(!userId || !requestId)
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    NormRequest.remove({_id:requestId, _user:userId}, function(err){
        if (err) {
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

module.exports = router;