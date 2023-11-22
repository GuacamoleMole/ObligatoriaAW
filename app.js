"use strict";
const conf = require("./database/configuration")

const express = require('express');
const path = require('path');
const session = require('express-session');
const mysqlSession = require("express-mysql-session"); 
const expressValidator = require('express-validator');
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const morgan = require('morgan');

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(conf.connection);
var app = express();

// inicialización engine de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  saveUninitialized: false,
  secret: "foobar34",
  resave: false,
  store: sessionStore
}))

// middlewares predefinidos
// morgan (registro peticiones)
app.use(morgan('dev'));
// static (sirce contenido estático)
app.use(express.static(path.join(__dirname, 'public')));
// json y urlencoded (en vez de body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// express-validator (validación de formularios)
app.use(expressValidator());

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
  datos.rol = 'usuario'
  request.session.currentUser = datos;

  // Checks de validación
  // checkeamos que los campos obligatorios no estén vacíos (redundante con el front, da mayor seguridad)
  check("nombre", "El nombre es obligatorio").notEmpty();
  check("apellidos", "Los apellidos son obligatorios").notEmpty();
  check("facultad", "La facultad es obligatoria").notEmpty();
  check("curso", "El curso es obligatorio").notEmpty();
  check("grupo", "El grupo es obligatorio").notEmpty();
  check("email", "El email es obligatorio").notEmpty();
  check("contrasena", "La contraseña es obligatoria").notEmpty();

  // checkeamos que el email sea un email
  check("email", "El email no es válido").isEmail();

  // checkeamos que el nombre y apellidos no tengasn números
  check("nombre", "El nombre no puede contener números").isAlpha();
  check("apellidos", "Los apellidos no pueden contener números").isAlpha();
  
  // Haz algo con los datos (por ejemplo, guardarlos en la base de datos)

  // Enviar una respuesta de éxito
  response.status(200).send("¡Registro exitoso!");
});

//Ruta inicio de sesión
app.get("/login", function(request, response,next) {
  response.status(200);
  response.render("login");
});

app.post("")
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
