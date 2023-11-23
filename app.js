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
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const { type } = require("os");
const multerFactory = multer({storage: multer.memoryStorage()});
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

//Ruta inicio de sesión
app.get("/login", function(req, res, next) {
  res.status(200);
  res.render("login");
});


//Ruta de registro
app.get("/registroUsuario", function(req, res, next) {
  res.status(200);
  res.render("registroUsuario", { errores: {} });
});

// Ruta de registro (POST)
app.post("/registroUsuario", multerFactory.single('imagenPerfil'),function(req, res, next) {
  // Recoger los datos del formulario
  console.log(req.body);
  let datos = {};
  datos.nombre = req.body.nombre;
  datos.apellidos = req.body.apellidos;
  datos.facultad = req.body.facultad;
  datos.curso = req.body.curso;
  datos.grupo = req.body.grupo;
  datos.email = req.body.email;
  datos.contrasena = req.body.contrasena;
  // Puede ser que los usuarios no añadan imagen y haya que poner una por defecto
  // datos.imagen = req.file.buffer; //Buffer del multer para guardar la imagen 
  datos.rol = 'usuario';
  datos.validado = false; //Siempre hay que ser validador por un Admin
  req.session.currentUser = datos;

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
  check("nombre", "El nombre no puede contener números").matches(/^[a-zA-Z]+$/);
  check("apellidos", "Los apellidos no pueden contener números").matches(/^[a-zA-Z]+$/);
  
  // Haz algo con los datos (por ejemplo, guardarlos en la base de datos)

  const errors = validationResult(req);
  console.log(req.body.nombre);
  console.log(typeof req.body.nombre);
  if (!errors.isEmpty()) {
    // Si hay errores, renderizamos la vista de registro de nuevo con los errores
    return res.render("registroUsuario", { errores: errors.array() });
  } else {
    // Si no hay errores enviamos una respuesta de éxito
    res.status(200).send("¡Registro exitoso!");
    //Rederigimos a la cuenta del usuario
    // TODO: como los email tienen ., cogería el contenido hasta el .
    //res.redirect(`/usuario/${req.body.email}`);
  }
});

// Ruta para mostrar la página de usuario con EJS
app.get('/usuario/:email', (req, res) => {
  // Obtener el parámetro de la URL
  const email = req.params.email;
  //TODO Como email es UNIQUE, buscar todos los datos en BBDD
  // Renderizar la plantilla EJS y pasar el parámetro
  //res.render('usuario', { email });
});

// // TODO: todo esto hay que reorganizarlo
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  const error = new Error("Página no encontrada");
  error.status = 404;
  next(error);
});


//middleware de errores 
app.use((error, req, res, next) => {
  // Código 500: Internal server error
  res.status(error.status || 500);
  res.render("error", {
    status : error.status,
    mensaje: error.message,
    pila: error.stack
  });
});

app.listen(3001, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log("Servidor corriendo en el puerto 3001");
  }
});

module.exports = app;
