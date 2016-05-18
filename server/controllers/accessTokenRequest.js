/**
 * Created by kevingu on 5/7/16.
 */
var express = require('express');
var router = express.Router();
var Constants = require('../util/Constants.js');
var AuthMiddleWare = require('./../util/AuthMiddleware.js');
var AccessTokenRequest = require('../models/AccessTokenRequest');

/**
 * @api {get} /accessTokenRequest/ Get User's access token requests
 * @apiGroup AccessTokenRequests
 * @apiName Get Access Token request
 *
 * @apiHeader {String} Authorization "Bearer "+token.
 * @apiHeaderExample {json} Header:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkQXQiOiIyMDE2LTA1LTA3VDIyOjM5OjQ1LjkwNloiLCJleHBEYXRlIjoiMjAxNi0wNS0wOFQxNToxOTo0NS44NTBaIiwidXNlcklkIjoiNTcxYjFmN2I2MmRlODgyMDU3MDE4Nzg2IiwiX2lkIjoiNTcyZTZlYjE0NzZlMjQ3YzdmZGUzOGI4In0.5mun3hgm73UuYYXhKZ8f3YKwDPc1gR3I09Q_8DNV"
 *     }
 *
 * @apiSampleRequest http://plug-mobile.herokuapp.com/api/accessTokenRequests
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          status: "Success"
 *          data:{
 *              "_id" : "572e87b64c690dcd1369051c",
 *              "_user" : "571b1f7b62de882057018786" ,
 *              "__v" : 0
 *          }
 *     }
 *
 * @apiError Wrong Request Id
 *
 * @apiErrorExample Fail-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Fail",
 *       "message": "The provided id is invalid";
 *     }
 *
 */
router.get('/', AuthMiddleWare.isAuthorized, function (req, res) {
    AccessTokenRequest.findOne({_user: req.user._id}, function(err, atRequest){
        if(err) {
           return res.json({
               status: Constants.status.ERROR,
               message: err.message
           });
        }
        if(!atRequest)
            return res.json({
                status: Constants.status.FAIL,
                msg: Constants.failedMessages.CAN_NOT_FIND_ID
            });
        return res.json({
            status: Constants.status.SUCCESS,
            data: atRequest
        });
    });
});

/**
 * @api {delete} /accessTokenRequest/ Get User's access token requests
 * @apiGroup AccessTokenRequests
 * @apiName Delete Access Token request
 *
 * @apiHeader {String} Authorization "Bearer "+token.
 * @apiHeaderExample {json} Header:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkQXQiOiIyMDE2LTA1LTA3VDIyOjM5OjQ1LjkwNloiLCJleHBEYXRlIjoiMjAxNi0wNS0wOFQxNToxOTo0NS44NTBaIiwidXNlcklkIjoiNTcxYjFmN2I2MmRlODgyMDU3MDE4Nzg2IiwiX2lkIjoiNTcyZTZlYjE0NzZlMjQ3YzdmZGUzOGI4In0.5mun3hgm73UuYYXhKZ8f3YKwDPc1gR3I09Q_8DNV"
 *     }
 *
 * @apiSampleRequest http://plug-mobile.herokuapp.com/api/accessTokenRequests
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          status: "Success"
 *          data:{
 *              "_id" : "572e87b64c690dcd1369051c",
 *              "_user" : "571b1f7b62de882057018786" ,
 *              "__v" : 0
 *          }
 *     }
 *
 * @apiError Wrong Request Id
 *
 * @apiErrorExample Fail-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "Fail",
 *       "message": "The provided id is invalid";
 *     }
 *
 */
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