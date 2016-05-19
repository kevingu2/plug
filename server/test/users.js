/**
 * Created by kevingu on 4/22/16.
 */

var request = require('supertest');
var User     = require('../models/User');
var Token = require('../models/Token');
var config = require('../config/config.js');
var Constants = require('../util/Constants.js');
var should = require('chai').should();

describe("Users Test", function() {
    var url = "localhost:" + config.port;

    var email1 = "test1@gmail.com";
    var password1 = "test1";
    var first_name1 = "test1";
    var last_name1 = "test1";
    var token1 = null; //will be set after user is created
    var user = null;

    before(function(done) {
        User.remove({email: email1}, function(err, _){
            if(err) throw err;
            done();
        });
    });

    describe("Signup ", function(){
        it('should create a User', function(done){
            request(url)
                .post('/api/users')
                .send({
                    email:email1,
                    password: password1,
                    first_name: first_name1,
                    last_name: last_name1
                })
                .end(function(err, res){
                    if(err)
                        throw(err);
                    res.body.should.have.property('status').and.be.equal(Constants.status.SUCCESS);
                    res.body.should.not.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    token1 = res.body.data;
                    done();
                });
        });
        it('should not create a User', function(done){
            request(url)
                .post('/api/users')
                .send({
                    email:email1,
                    password: password1
                })
                .end(function(err, res){
                    if(err)
                        throw(err);
                    res.body.should.have.property('status').and.be.equal(Constants.status.FAIL);
                    res.body.should.have.property('message');
                    res.body.should.not.have.property('data');
                    done();
                });
        });
    });

    describe("Get ", function(){
        it('should get User info', function(done) {
            request(url)
                .get('/api/users')
                .set('Authorization', 'Bearer '+token1.value)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw(err);
                    res.body.should.have.property('status').and.be.equal(Constants.status.SUCCESS);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('email').and.be.equal(email1);
                    res.body.data.should.not.have.property('password');
                    user = res.body.data;
                    done();
                });
        });
    });


    after(function(done) {
        User.remove({_id: user._id}, function(err, _){
            if(err) throw err;
            Token.remove({_id: token1._id}, function(err, _){
                if(err) throw err;
                done();
            });
        });
    });

});