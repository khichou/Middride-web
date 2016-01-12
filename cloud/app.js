var express = require('express');
var path = require('path');
var favicon = require('cloud/node_modules/serve-favicon/index.js');
//var logger = require('cloud/node_modules/morgan/index.js');
//var cookieParser = require('express.cookieParser');
//var bodyParser = require('express.bodyParser');

//var routes = require('cloud/routes/index');
//var users = require('cloud/routes/users');

var app = express();


var __dirname ="cloud";
    //path.resolve(path.dirname());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.use(logger('dev'));

//app.use(bodyParser.json());
app.use(express.bodyParser());

//app.use(bodyParser.urlencoded({ extended: false }));

//app.use(cookieParser());
app.use(express.cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
// catch 404 and forward to error handler

var locationController = require("cloud/controllers/locations");
app.get('/', function(req, res, next) {
  locationController.index(req,res);
}
);

app.post('/notify/:loc_id/comments', function(req, res, next) {
      locationController.notify(req,res);
    }
);

app.get("/hello", function (req,res,next) {
  res.render('hello',{
    title: "Dispatcher Portal",
  });

})

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
      title: "ERROR1",
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: "ERROR2",
    message: err.message,
    //todo: uncheck this
    error: err
//    error: {}
  });
});

app.listen();

//module.exports = app;
