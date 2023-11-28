"use strict";
const conf = require("./database/configuration")

const express = require('express');
const path = require('path');
const session = require('express-session');
const mysqlSession = require("express-mysql-session"); 
const bcrypt = require('bcrypt');
const DAOUsuario = require('./database/DAOUsuario')
const daoUsuario = new DAOUsuario();
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const morgan = require('morgan');
const multer = require("multer");
const { body, check, validationResult } = require("express-validator");
const { type } = require("os");
const multerFactory = multer({storage: multer.memoryStorage()});
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(conf.connection);
const app = express();

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
app.get("/login", function(req, res) {
  res.status(200);
  res.render("login" , { errores: {} });
});

app.post(
  "/login", 
  check("email", "El email es obligatorio").notEmpty(),
  check("contrasena", "La contraseña es obligatoria").notEmpty(),
  // checkeamos que el email sea un email
  check("email", "El email no es válido").isEmail(),
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      // Si hay errores, renderizamos la vista de registro de nuevo con los errores
      return res.render("login", { errores: errors.array() });
    }
    // Si no hay errores, continuamos
    const { correo, contrasena } = req.body
    daoUsuario.buscarPorEmail(correo, (err, usr) => {
      if (err) {
        //TODO: enviar mensaje de error al usuario si no encuentra email en BD?
        next(err);
      } else {  
        bcrypt.compare(contrasena, usr.contraseña, (err, valid) => {
          if (err) {
              next(err);
          } 
          if (valid) {
              req.session.user = { correo, id: usr.id };
              res.send("Sesión iniciada.");
          } else {
              res.status(401).end(); // contraseña invalida
          }
        });
      }
    });    
  }
);

//Ruta de registro
app.get("/registroUsuario", function(req, res, next) {
  res.status(200);
  res.render("registroUsuario", { errores: {} });
});

// Ruta de registro (POST)
app.post(
  "/registroUsuario",
  // Checks de validación
  // checkeamos que los campos obligatorios no estén vacíos (redundante con el front, da mayor seguridad)
  multerFactory.single('imagenPerfil'),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("apellidos", "Los apellidos son obligatorios").notEmpty(),
  check("facultad", "La facultad es obligatoria").notEmpty(),
  check("curso", "El curso es obligatorio").notEmpty(),
  check("grupo", "El grupo es obligatorio").notEmpty(),
  check("email", "El email es obligatorio").notEmpty(),
  check("contrasena", "La contraseña es obligatoria").notEmpty(),
  // checkeamos que el email sea un email
  check("email", "El email no es válido").isEmail(),
  // checkeamos que el nombre y apellidos no tengasn números
  check("nombre", "El nombre no puede contener números").matches(/^[a-zA-Z]+$/),
  check("apellidos", "Los apellidos no pueden contener números").matches(/^[a-zA-Z]+$/),
  //checkeamos que sea un email de la UCM
  check("email", "El email debe ser de la UCM").matches(/^[a-zA-Z0-9]+@ucm.es$/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      // Si hay errores, renderizamos la vista de registro de nuevo con los errores
      return res.render("registroUsuario", { errores: errors.array() });
    }
    // Si no hay errores, continuamos
    // Recoger los datos del formulario
    let datos = {};
    datos.nombre = req.body.nombre;
    datos.apellidos = req.body.apellidos;
    datos.facultad = req.body.facultad;
    datos.curso = req.body.curso;
    datos.grupo = req.body.grupo;
    datos.email = req.body.email;
    datos.contrasena =  bcrypt.hashSync(req.body.contrasena,11); //encriptar contraseña

    if(req.file)
      datos.imagen = req.file.buffer; //Buffer del multer para guardar la imagen 
    datos.rol = 'usuario';
    datos.validado = false; //Siempre hay que ser validador por un Admin

    daoUsuario.insertarUsuario(datos, (err, usr) => {
      if (err) {
        // TODO: informar al usuario de que existe email ya registrado?
        next(err);
      } else {  
        //res.redirect(`/usuario/${usr}`); usr --> id insertado
        res.status(200).send("¡Registro exitoso!");
      }
    }); 
  }
);

// Ruta para mostrar la página de usuario con EJS
app.get('/usuario/:id', (req, res) => {
  // Obtener el parámetro de la URL
  const id = req.params.id;
  //TODO Como email es UNIQUE, buscar todos los datos en BBDD y pasarlos a la vista
  // Renderizar la plantilla EJS y pasar el parámetro
  //res.render('usuario', { email });
  res.render('cuentaUsuario', { id });
});


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
