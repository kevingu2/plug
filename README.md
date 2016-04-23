#Plug
##1. Getting Started

###1.1 List of Requirements
1. [Node Js](http://nodejs.org) (http://nodejs.org)
2. [MongoDb](https://www.mongodb.org) (https://www.mongodb.org)

###1.2 Instructions
**Step 1:** Clone our project on [Github](https://github.com/kevingu2/plug.git)(https://github.com/kevingu2/plug.git)

**Step 2:** run **npm install** in the directory of the project to install the dependency for the backend

**Step 3:** run **gulp test:backend** to test the backend api, all the tests should pass

**Step 5:** run **npm start** to start the application

##Plug Server API

200 : success

403 : Unauthorized

404 : Not Found

##Status
responses will contain a status

	success
	fail
	error

fail and error will contain a message while success will contain a data field.

##1. Token

###Create

#####Post /api/token

**required**

	email
	password
	
####Responses
**Success**

	{	
    	"status": "success",
    	"data": {
        	"__v": 0,
        	"value": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NzFiMWY3YjYyZGU4ODIwNTcwMTg3ODYiLCJfaWQiOiI1NzFiMjA1MTYyZGU4ODIwNTcwMTg3ODkiLCJjcmVhdGVkQXQiOiIyMDE2LTA0LTIzVDA3OjA3OjM5Ljg5NloiLCJleHBEYXRlIjoiMjAxNi0wNC0yM1QwNzowODozOS44OTZaIn0.ggp6s3q0GRC_0zes4MlMXJO0FUpdLJqEgMju7s8u6to",
        	"userId": "571b1f7b62de882057018786",
        	"_id": "571b205162de882057018789",
        	"createdAt": "2016-04-23T07:07:39.896Z",
        	"expDate": "2016-04-23T07:08:39.896Z"
		}
	}

**Failure**

	{
    	"status": "fail",
    	"message": "Incorrect email/password"
	}
	
##2. Users

###Create

#####Post /api/users

**required**
	
	email
	password
	
####Responses
**Success**

	{
    	"status": "success",
    	"data": {
        	"__v": 0,
        	"value": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NzFiMWY3YjYyZGU4ODIwNTcwMTg3ODYiLCJfaWQiOiI1NzFiMWY3YjYyZGU4ODIwNTcwMTg3ODciLCJjcmVhdGVkQXQiOiIyMDE2LTA0LTIzVDA3OjA3OjM5Ljg5NloiLCJleHBEYXRlIjoiMjAxNi0wNC0yM1QwNzowODozOS44OTZaIn0.nl9ajmNai3XkWESzZTUwnZQbNYam4YMwa5Smk1ImkNg",
        	"userId": "571b1f7b62de882057018786",
        	"_id": "571b1f7b62de882057018787",
        	"createdAt": "2016-04-23T07:07:39.896Z",
        	"expDate": "2016-04-23T07:08:39.896Z"
    	}
	}
	
**Error**

	{
    	"status": "error",
    	"message": "insertDocument :: caused by :: 11000 E11000 duplicate key error index: plug.users.$email_1  dup key: { : \"test@yahoo.com\" }"
	}
	
###Get

####Get /api/users

**required**
	An Authorization header is required with a the string "bearer" appended with the token value.
	
**Success**

	{
    	"status": "success",
    	"data": {
       		"_id": "571b1f7b62de882057018786",
        	"email": "test@yahoo.com",
        	"__v": 0
    	}
	}
	
**Failure**

	{
    	"status": ,
    	"error": "Expired Token"
	}

	{
    	"type": false,
    	"msg": "No Token"
	}

