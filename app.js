"use strict";
const conf = require("./database/configuration")
const express = require('express');
const path = require('path');
const session = require('express-session');
const mysqlSession = require("express-mysql-session"); 
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const morgan = require('morgan');

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(conf.connection);
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  saveUninitialized: false,
  secret: "foobar34",
  resave: false,
  store: sessionStore
}))

//app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Ruta de registro
app.get("/registroUsuario", function(request, response,next) {
  response.status(200);
  response.render("registroUsuario");
});

// Ruta de registro (POST)
app.post("/registroUsuario", function(request, response, next) {
  // Recoger los datos del formulario
  console.log(request.body);
  let datos = {};
  datos.nombre = request.body.nombre;
  datos.apellidos = request.body.apellidos;
  datos.facultad = request.body.facultad;
  datos.curso = request.body.curso;
  datos.grupo = request.body.grupo;
  datos.email = request.body.email;
  datos.contrasena = request.body.contrasena;
  datos.imagenPerfil = request.body.imagenPerfil;
  request.session.currentUser = datos;
  // Haz algo con los datos (por ejemplo, guardarlos en la base de datos)

  // Enviar una respuesta de éxito
  response.status(200).send("¡Registro exitoso!");
});

//Ruta inicio de sesión
app.get("/login", function(request, response,next) {
  response.status(200);
  response.render("login");
});

// // TODO: todo esto hay que reorganizarlo
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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
