"use strict";

const { Router } = require("express");
const bcrypt = require("bcrypt");
const DAOUsuario = require("../database/DAOUsuario");
const DAOConfiguracion = require("../database/DAOConfiguracion");
const daoUsuario = new DAOUsuario();
const daoConfiguracion = new DAOConfiguracion();
const multer = require("multer");
const { body, check, validationResult } = require("express-validator");
const { type } = require("os");
const DAOReservas = require("../database/DAOReservas");
const DAOInstalaciones = require("../database/DAOInstalaciones");
const daoReservas = new DAOReservas();
const daoInstalaciones = new DAOInstalaciones();
const storage = multer.memoryStorage(); // Almacenar los datos en memoria en lugar de en archivos
const upload = multer({ storage: storage });
const router = Router();
const { verificarAutenticacion, soloAdmin } = require('../middlewares/acceso');
const DAOMensajes = require("../database/DAOMensajes");
const daoMensajes = new DAOMensajes();

//Ruta inicio de sesión
router.get("/login", function (req, res) {
  res.status(200);
  let datos = {};
  datos.conf = req.app.locals.configuracion
  if (req.session.user !== undefined) {
    datos.session = req.session.user;
  }
  res.render("login", { datos, errores: {} });
});

router.post(
  "/login",
  check("email", "El email es obligatorio").notEmpty(),
  check("contrasena", "La contraseña es obligatoria").notEmpty(),
  // checkeamos que el email sea un email
  check("email", "El email no es válido").isEmail(),
  function (req, res) {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", { errores: errors.array() });
    }
    //Si no hay errores, continuamos
    const { email, contrasena } = req.body;
    daoUsuario.buscarPorEmail(email, (err, usr) => {
      if (err) {
        next(err);
      } else {
        if (usr === undefined)
          errors.errors.push({
            msg: "Email no existe",
          });

        if (!errors.isEmpty())
          return res.render("login", { errores: errors.array() });

        bcrypt.compare(contrasena, usr.contraseña, (err, valid) => {
          if (err) {
            next(err);
          }
          if (valid) {
            req.session.user = { email: email, id: usr.id, nombre: usr.nombre, facultad: usr.facultad, rol: usr.rol, validado: usr.validado };
            res.redirect("/");
          } else {
            errors.errors.push({
              msg: "Contraseña incorrecta",
            });
            return res.render("login", { errores: errors.array() });
          }
        });
      }
    });
  }
);

//Ruta de registro
router.get("/registro", function (req, res) {
  res.status(200);
  let datos = {};
  datos.conf = req.app.locals.configuracion
  if (req.session.user !== undefined) {
    datos.session = req.session.user;
  }
  res.render("registroUsuario", { datos, errores: {} });
});

// Ruta de registro (POST)
router.post(
  "/registro",
  // Checks de validación
  // checkeamos que los campos obligatorios no estén vacíos (redundante con el front, da mayor seguridad)
  upload.single("imagenPerfil"),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("apellidos", "Los apellidos son obligatorios").notEmpty(),
  check("facultad", "La facultad es obligatoria").notEmpty(),
  check("curso", "El curso es obligatorio").notEmpty(),
  check("grupo", "El grupo es obligatorio").notEmpty(),
  check("email", "El email es obligatorio").notEmpty(),
  check("contrasena", "La contraseña es obligatoria").notEmpty(),
  // checkeamos que el email sea un email
  check("email", "El email no es válido").isEmail(),
  // checkeamos que el nombre y apellidos no tengan números (aceptar tildes, diéresis y ñ)
  check("nombre", "El nombre no puede contener números").matches(
    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
  ),
  check("apellidos", "Los apellidos no pueden contener números").matches(
    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
  ),
  //checkeamos que sea un email de la UCM
  check("email", "El email debe ser de la UCM").matches(
    /^[a-zA-Z0-9]+@ucm.es$/
  ),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("registroUsuario", { errores: errors.array() });
    }
    // Si no hay errores, recogemos los datos del formulario
    let datos = {};
    datos.nombre = req.body.nombre;
    datos.apellidos = req.body.apellidos;
    datos.facultad = req.body.facultad;
    datos.curso = req.body.curso;
    datos.grupo = req.body.grupo;
    datos.email = req.body.email;
    datos.contrasena = bcrypt.hashSync(req.body.contrasena, 11); //encriptar contraseña
    if (req.file) datos.imagen = req.file.buffer; //Buffer del multer para guardar la imagen
    datos.rol = "usuario";
    datos.validado = false; //Siempre hay que ser validador por un Admin

    daoUsuario.buscarPorEmail(datos.email, (err, usr) => {
      if (err) {
        next(err);
      } else {
        if (usr !== undefined) {
          errors.errors.push({
            msg: "Email duplicado",
          });
        }
        if (!errors.isEmpty()) {
          return res.render("registroUsuario", { errores: errors.array() });
        } else {
          daoUsuario.insertarUsuario(datos, (err, usr) => {
            if (err) {
              next(err);
            } else {
              req.session.user = {
                email: datos.email,
                id: usr,
                nombre: datos.nombre,
                facultad: datos.facultad,
                rol: datos.rol,
                validado: usr.validado
              };
              res.redirect("/");
            }
          });
        }
      }
    });
  }
);

router.delete("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (!err) {
      res.send("Log Out!");
      res.redirect("/");
    } else next(err);
  });
});

router.get("/busqueda", verificarAutenticacion, soloAdmin, (req,res,next) =>{
  const filtros = req.query;
  let sql = `
    SELECT nombre, apellidos, email, facultad
    FROM UCM_AW_RIU_USU_Usuarios
    WHERE 1=1`;
  if(filtros.facultad !== 'todos') {
    sql += ` AND facultad = '${filtros.facultad}'`;
  }
  if(filtros.email !== undefined) {
    sql += ` AND email LIKE '%${filtros.email}%'`;
  }

  if(filtros.nombre !== undefined) {
    sql += ` AND nombre LIKE '%${filtros.nombre}%'`;
  }

  if(filtros.apellidos !== undefined) {
    sql += ` AND apellidos LIKE '%${filtros.apellidos}%'`;
  }
  let datos = {};
  daoUsuario.busquedaAvanzada(sql, (err, result) =>{
    if(err) {
      next(err);
    }else {
      datos.usuarios = result;
      for (let i = 0; i < datos.usuarios.length; i++) {
        datos.usuarios[i].fecha = new Date(
          datos.usuarios[i].fecha
        ).toLocaleDateString();
      }
      res.render("busquedaUsuarios", { datos });
    }
  });
});

// Ruta para mostrar la página de usuario con EJS
router.get("/:id", verificarAutenticacion, (req, res, next) => {
  let datos = {};
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const error = new Error("Petición incorrecta");
    error.status = 404;
    next(error);
  }
  datos.id = id; // Obtener el parámetro de la URL

  daoUsuario.buscarPorID(id, (err, usuario) => {
    if (err) {
      next(err);
    } else {
      if (usuario === undefined) {
        //si no se encuentra el usuario, pasamos al middleware de ruta no encontrada
        next();
      } else {
        datos.nombre = usuario.nombre;
        datos.apellidos = usuario.apellidos;
        datos.email = usuario.email;
        datos.facultad = usuario.facultad;
        datos.curso = usuario.curso;
        datos.grupo = usuario.grupo;
        datos.rol = usuario.rol;
        datos.validado = usuario.validado;
        if (datos.validado) datos.vali = "SÍ";
        else datos.vali = "NO";
        datos.conf = req.app.locals.configuracion

        if (req.session.user !== undefined) {
          datos.session = req.session.user;
        }
        res.render("cuentaUsuario", { datos });
      }
    }
  });
});

router.get("/:id/reservas", verificarAutenticacion, (req, res, next) => {
  let datos = {};
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const error = new Error("Petición incorrecta");
    error.status = 404;
    next(error);
  }
  datos.id = id;

  daoReservas.obtenerTodaInformacionReservasPorID(id, (err, reservas) => {
    if (err) {
      next(err);
    } else {
      datos.reservas = reservas;
      for (let i = 0; i < datos.reservas.length; i++) {
        datos.reservas[i].fecha = new Date(
          datos.reservas[i].fecha
        ).toLocaleDateString();
      }
      if (req.session.user !== undefined) {
        datos.session = req.session.user;
      }
      datos.conf = req.app.locals.configuracion;
      res.render("misReservas", { datos });
    }
  });
});

router.get("/admin/pendientes", verificarAutenticacion, soloAdmin, (req, res, next) => {
  let datos = {};
  daoUsuario.buscarNoValidados((err, usuarios) => {
    if (err) next(err);
    else {
      datos.usuarios = usuarios;
      if (req.session.user !== undefined) {
        datos.session = req.session.user;
      }
      datos.conf = req.app.locals.configuracion
      res.render("pendientes", { datos });
    }
  });
});

router.put("/admin/validar/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const error = new Error("Petición incorrecta");
    error.status = 404;
    next(error);
  }
  daoUsuario.validarUsuario(id, (err) => {
    if (err) next(err);
    else {
      console.log(id);
      const idOrigen = req.session.user.id;
      const idDestino = id;
      const asunto = "Bienvenido/a";
      const mensaje = "¡Bienvenido/a a la aplicación! Ahora podrás ver y enviar tus mensajes, así como hacer reservas en las distintas instalaciones.";
      daoMensajes.enviarMensaje({ idOrigen, idDestino, mensaje, asunto }, (err, idM) => {
        if (err) {
          console.log("hubo error");
          console.log(err);
          next(err);
        }
        else {
          console.log("mensaje enviado");
          res.send(`ID:${id} ahora es validado`);
        }
      });
    }
  });
});

router.get("/admin/hacerAdmin", verificarAutenticacion, soloAdmin,(req, res, next) => {
  let datos = {};
  //Ademas de ser usuario, tiene que estar validado
  //Esto lo comprueba ya la query de la BBDD
  daoUsuario.buscarRolUsuario((err, usuarios) => {
    if (err) next(err);
    else {
      datos.usuarios = usuarios;
      if (req.session.user !== undefined) {
        datos.session = req.session.user;
      }
      datos.conf = req.app.locals.configuracion
      res.render("hacerAdmin", { datos });
    }
  });
});

router.put("/admin/hacerAdmin/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const error = new Error("Petición incorrecta");
    error.status = 404;
    next(error);
  }
  daoUsuario.hacerAdmin(id, (err) => {
    if (err) next(err);
    else {
      res.send(`ID:${id} ahora es Admin`);
    }
  });
});

router.get("/admin/crearInstalacion",verificarAutenticacion, soloAdmin, (req, res, next) => {
  let datos = {};

  if (req.session.user !== undefined) {
    datos.session = req.session.user;
  }
  datos.conf = req.app.locals.configuracion
  res.status(200);
  res.render("crearInstalacion", { datos, errores: {} });
});

router.get("/admin/configuracionSistema",verificarAutenticacion, soloAdmin, (req, res, next) => {
  let datos = {};

  if (req.session.user !== undefined) {
    datos.session = req.session.user;
  }
  datos.conf = req.app.locals.configuracion
  res.status(200);
  res.render("configuracionSistema", { datos, errores: {} });
});

router.post(
  "/admin/configurarSistema",
  upload.single("imagenPerfil"),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("direccion", "La direccion es obligatoria").notEmpty(),
  check("ciudad", "La ciudad es obligatoria").notEmpty(),
  check("pais", "El pais es obligatorio").notEmpty(),
  // checkeamos que ciudad y pais no tengan números (aceptar tildes, diéresis y ñ)
  check("ciudad", "La ciudad no puede contener números").matches(
    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
  ),
  check("pais", "El pais no puede contener números").matches(
    /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
  ),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("registroUsuario", { errores: errors.array() });
    }
    let datos = {};
    datos.nombre = req.body.nombre;
    datos.calle = req.body.direccion;
    datos.ciudad = req.body.ciudad;
    datos.pais = req.body.pais;
    if (req.file) 
     datos.logo = req.file.buffer;
    daoConfiguracion.cambiarConf(datos, (err, id) => {
      if (err) {
        next(err);
      } else {
        // Recargar la configuración y almacenarla en req.app.locals.configuracion
        daoConfiguracion.buscarConf((err, configuracion) => {
          if (err) {
            next(err);
          }
          req.app.locals.configuracion = configuracion;
          // Redirigir a la página principal
          res.redirect("/");
        });
      }
    });
  }
);

router.get("/admin/historialReservas", verificarAutenticacion, soloAdmin,(req, res, next) => {
  let datos = {};

  if (req.session.user !== undefined) {
    datos.session = req.session.user;
  }
  datos.conf = req.app.locals.configuracion

  daoReservas.obtenerTodaInformacionReservas((err, reservas) => {
    if (err) next(err);
    else {
      datos.reservas = reservas;
      for (let i = 0; i < datos.reservas.length; i++) {
        datos.reservas[i].fecha = new Date(
          datos.reservas[i].fecha
        ).toLocaleDateString();
      }
      daoInstalaciones.buscarTodasInstalaciones((err, instalaciones) => {
        if (err) next(err);
        else {
          datos.instalaciones = instalaciones;
          res.status(200);
          res.render("historialReservas", { datos });
        }
      });
    }
  });
});

router.get("/admin/listarUsuarios", verificarAutenticacion, soloAdmin,(req, res, next) => {
  let datos = {};

  if (req.session.user !== undefined) {
    datos.session = req.session.user;
  }
  datos.conf = req.app.locals.configuracion
  daoUsuario.buscarValidados((err, usuarios) => {
    if (err) next(err);
    else {
      datos.usuarios = usuarios;
      res.status(200);
      res.render("listarUsuarios", { datos });
    }
  });
});

module.exports = router;
