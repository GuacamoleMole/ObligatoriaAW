"use strict";
const conf = require("./database/configuration")
const express = require('express');
const DAOInstalaciones = require('./database/DAOInstalaciones')
const DAOConfiguracion = require('./database/DAOConfiguracion')
const daoInstalaciones = new DAOInstalaciones();
const daoConfiguracion = new DAOConfiguracion();
const path = require('path');
const session = require('express-session');
const mysqlSession = require("express-mysql-session"); 
const morgan = require('morgan');

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

// Middleware para cargar la configuración antes de enrutar las solicitudes
app.use((req, res, next) => {
  // Llamada a buscarConf para obtener la configuración
  daoConfiguracion.buscarConf((err, configuracion) => {
    if (err) {
      console.error('Error al buscar la configuración:', err);
    } else {
      // Almacena la configuración en req.app.locals para que esté disponible en todas las rutas
      req.app.locals.configuracion = configuracion;
    }
    // Continúa con el siguiente middleware o la ruta
    next();
  });
});

app.use('/usuario',require('./routes/usuario'));
app.use('/instalacion',require('./routes/instalacion'));
app.use('/mensajes', require('./routes/mensajes'));
app.use('/reserva', require('./routes/reserva'));
app.use('/imagen', require('./routes/imagen'));


//Ruta página principal, en la que se muestran las instalaciones a reservar
app.get("/", function(req, res, next) {

  daoInstalaciones.buscarTodasInstalaciones((err, instalaciones) =>{
    if(err){
      next(err);
    } else{
      let datos = {};
      if(req.session.user !== undefined){
        datos.session = req.session.user;
      }
      datos.instalaciones = instalaciones;
      datos.conf = req.app.locals.configuracion
      console.log(datos.conf)
      res.render("index", {datos});
    }
  });
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
  console.log(error);
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
