var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bookingsRouter = require('./routes/bookings'); // around line 9
var pythonRouter = require('./routes/python');
var configRouter = require('./routes/configuration');
var navigationRouter = require('./routes/navigation');
var app = express();

process.env.TOKEN_SECRET = 'secret';

try {
  var jwt = require('jsonwebtoken');
  var passport = require('passport');
  var BearerStrategy = require('passport-http-bearer').Strategy;
  passport.use(new BearerStrategy(
    function (token, done) {
      jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
          console.error('JWT Verification Error:001', err.name, err.message);
          return done(err);
        }
        return done(null, decoded, { scope: "all" });
      });
    }
  ));
} catch (error) {
  console.log(`01` + error);
  return error;
};

console.log(process.env.TOKEN_SECRET);


app.use('/api/python', function (req, res, next) {
  console.log('Python route accessed:', req.method, req.path);
  next();
}, pythonRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('json spaces', 2);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/users', passport.authenticate('bearer', { session: false }), usersRouter);
app.use('/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/python', pythonRouter);
app.use('/api/navigation', navigationRouter);
app.use('/api/config', configRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
