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


router.get('/', AuthMiddleWare.isAuthorized, function (req, res){
    var currDate = new Date();
    var timeOutDate = currDate.getTime() + 50000;
    var userId = req.user._id;
    var date = req.query.date;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    if(!userId || !date || !latitude || !longitude){
        return res.json({
            status: Constants.status.FAIL,
            message: Constants.failedMessages.MISSING_FIELDS
        });
    }
    //TODO optimize this to add query for distance
    NormRequest.find({date:{ $lte:timeOutDate}}).populate('_user', '-password').exec(function(err, requests){
        //add own request to the Request
        var request = new Request();
        request._user = userId;
        request.date = date;
        request.latitude = latitude;
        request.longitude = longitude;
        request.save(function(err){
            if(err)
                console.log(err);
        });
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
                var dist = Math.sqrt(Math.pow(r.latitude-latitude, 2)+Math.pow(r.longitude-longitude, 2));
                console.log("Dist: "+dist);
                if(dist <= MAX_DISTANCE){
                    nearUsers.push(r._user);
                }
            }
        }
        return res.json({
            status: Constants.status.SUCCESS,
            data:{
                request_id: request._id,
                users: nearUsers
            }
        })
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