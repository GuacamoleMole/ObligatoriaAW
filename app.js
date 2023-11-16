var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const morgan = require('morgan');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Ruta de registro
app.get("/registroUsuario", function(request, response,next) {
  response.status(200);
  response.render("registroUsuario");
});

//Ruta inicio de sesión
app.get("/login", function(request, response,next) {
  response.status(200);
  response.render("login");
});

// TODO: todo esto hay que reorganizarlo
app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.listen(3001, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("Servidor corriendo en el puerto 3001");
  }
});

module.exports = app;
