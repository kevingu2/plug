var dotenv = require('dotenv');
dotenv.load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var config = require('./server/config/config');
var session = require('express-session');

var environment = process.env.NODE_ENV;
var configDB = require('./server/config/database.json')[environment];

var app = express();

// Connect to the MongoDB
mongoose.connect(configDB.host, configDB.db, configDB.port,
    configDB.credentials,
    function(err) {
      if (err) {
        throw err;
      }
      console.log("Connected to MongoDB");
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', config.port);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* routes API*/
app.use('/api/tokens', require('./server/controllers/authentication.js'));
app.use('/api/users', require('./server/controllers/users.js'));
app.use('/api/snapchat', require('./server/controllers/snapchat.js'));
app.use('/api/instagram', require('./server/controllers/instagram.js'));
app.use('/api/requests', require('./server/controllers/normRequests.js'));
app.use('/api/socialMediaRequests', require('./server/controllers/socialMediaRequest.js'));
app.use('/api/accessTokenRequests', require('./server/controllers/accessTokenRequest.js'));
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode',
        app.get('port'),
        app.get('env'));
});

process.env.TZ = 'America/Los_Angeles';

module.exports = app;
