/**
 * Created by kevingu on 4/22/16.
 */

var request = require('supertest');
var User     = require('../models/User');
var Token = require('../models/Token');
var config = require('../config/config.js');
var Constants = require('../util/Constants.js');
var should = require('chai').should();

describe("Authentication Test", function() {
    var url = "localhost:" + config.port;

    var email1 = "test1@gmail.com";
    var password1 = "test1";
    var user = null;

    var tokenId1 = null;

    before(function(done) {
        user = new User();
        user.email = email1;
        user.password = password1;
        user.save(function(err){
            if(err) throw err;
            done();
        });
    });
    describe("Token Test", function(){
        it('should get a Token', function(done) {
            request(url)
                .post('/api/tokens')
                .send({
                    email: email1,
                    password: password1
                })
                .end(function (err, res) {
                    console.log(res.body);
                    if(err)
                        throw(err);
                    res.body.should.have.property('status').and.be.equal(Constants.status.SUCCESS);
                    res.body.should.not.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    tokenId1 = res.body.data._id;
                    done();
                });
        });
        it('should not get a Token', function(done) {
            request(url)
                .post('/api/tokens')
                .send({
                    email: email1
                })
                .end(function (err, res) {
                    if(err)
                        throw(err);
                    res.body.should.have.property('status').and.be.equal(Constants.status.FAIL);
                    res.body.should.have.property('message');
                    res.body.should.not.have.property('data');
                    done();
                });
        });

    })

    after(function(done) {
        User.remove({_id: user._id}, function(err, _){
            if(err) throw err;
            Token.remove({_id: tokenId1}, function(err, _){
                if(err) throw err;
                done();
            });
        });
    });
});