const express = require('express');
const app = express();
http = require('http');

const hostname = 'localhost';
const port = 3000;

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./config/authenticate');
var config = require('./config/config');

//var index = require('./routes/index');
var users = require('./app/routes/users');
var articleRouter = require('./app/routes/articleRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Articles = require('./app/models/articles');

// Connection URL
const url = config.mongoUrl;

const connect = mongoose.connect(url, {
    useMongoClient: true,
});

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

//app.use('/', index);
app.use('/users', users);
app.use(express.static(path.join(__dirname, '../client')));
app.use('/articles', articleRouter);

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

app.listen(port, function(err) {
    //console.log("running server on port " + port);
});