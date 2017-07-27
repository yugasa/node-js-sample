var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash-plus');
var multer  = require('multer');
//var popupS = require('popups');
// set destination of upload file.

var upload = multer({ dest: 'uploads/' });


//routes
var index = require('./routes/index');
var api   = require('./routes/api');

var app = express();

  //app.use(flash());
  //pp.use(cookieFlashMessages);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser('secretString'));
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true }));
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root        = namespace.shift()
      , formParam   = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      path      : formParam,
      message   : msg,
      value     : value
    };
  }
}));

app.use(cookieParser());
app.use(session({ 
  secret: "53cr3t50m3th1ng",
  resave: true,
  rolling: true,
  saveUninitialized: false,
   "cookie": {
            "maxAge":60 * 1000// 1 min
          }
  
}))



app.use(express.static(path.join(__dirname, 'public')));

//CORS
app.use(function(req, res, next) {
  res.header("access-control-allow-methods", "GET, POST, PUT");
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.param('db', function (req, res, next, db) {
  req.db = 'postgres_' + req.params.db;
  return next();
});

app.use('/', index);
app.use('/:db/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
