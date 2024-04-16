var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//routes
var indexRouter = require('./routes/index');
var auditRouter = require('./routes/audit');

//var usersRouter = require('./routes/users');
//var testRouter = require('./routes/test');
//var creRouter = require('./routes/createAudit');

// Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

var app = express();
const swaggerDocument = YAML.load('./swagger-api.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/js",express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/jquery",express.static(path.join(__dirname, "node_modules/jquery/dist/")))
app.use("/",express.static(path.join(__dirname, "public/javascripts/")))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Frontend
app.use('/', indexRouter);

//app.use('/users', usersRouter);
//app.use('/test', testRouter);
//app.use('/createAudit', creRouter);

// API
app.use('/api/audit', auditRouter);


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
  res.render('error');
});

module.exports = app;
