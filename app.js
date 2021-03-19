var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var socket = require('socket.io');
var app = express();
// database connection 
mongoose.connect("mongodb+srv://croissant:rouge@cluster0.hxuuy.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to db ...."))
    .catch(err => console.error('could not connect to MongoDb', err));
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accidentRouter = require('./routes/accident');

//Passport middleware
app.use(passport.initialize());
require("./strategies/jsonwtStrategy")(passport);



// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// MIDDLEWARES
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accident', accidentRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
});

var debug = require('debug')('node-croissant-rouge-app:server');
var http = require('http');
var socket = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

//var server = http.createServer(app);



/**
 * Listen on provided port, on all network interfaces.
 */


var server = app.listen(port, () => console.log("listening on port:" + port));



/**
 * 
 * socket setup
 */
// socket setup

var io = socket(server);

console.log("socket.io is ready to go ");

io.on('connection', function(socket) {
    console.log('made  socket connection')
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}


module.exports = app;