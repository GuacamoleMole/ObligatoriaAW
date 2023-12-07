"use strict";

const {Router} = require('express');
const bcrypt = require('bcrypt');
const DAOUsuario = require('../database/DAOUsuario')
const daoUsuario = new DAOUsuario();
const multer = require("multer");
const { body, check, validationResult } = require("express-validator");
const { type } = require("os");
const storage = multer.memoryStorage(); // Almacenar los datos en memoria en lugar de en archivos
const upload = multer({ storage: storage });
const router = Router();


//Ruta inicio de sesión
router.get("/login", function(req, res) {
  res.status(200);
  res.render("login" , { errores: {} });
});

router.post(
  "/login", 
  check("email", "El email es obligatorio").notEmpty(),
  check("contrasena", "La contraseña es obligatoria").notEmpty(),
  // checkeamos que el email sea un email
  check("email", "El email no es válido").isEmail(),
  function(req, res) {
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
        if(usr === undefined)
          errors.errors.push({
            msg: 'Email no existe',
          });
        
        if (!errors.isEmpty())
          return res.render("login", { errores: errors.array() });
        
        bcrypt.compare(contrasena, usr.contraseña, (err, valid) => {
          if (err) {
              next(err);
          } 
          if (valid) {
              req.session.user = { email: email, id: usr.id, nombre: usr.nombre };
              res.redirect("/");
          } else {
            errors.errors.push({
              msg: 'Contraseña incorrecta',
            });
            return res.render("login", { errores: errors.array() });
          }
        });
      }
    });    
   }
);

//Ruta de registro
router.get("/registro", function(req, res) {
  res.status(200);
  res.render("registroUsuario", { errores: {} });
});

// Ruta de registro (POST)
router.post(
  "/registro",
  // Checks de validación
  // checkeamos que los campos obligatorios no estén vacíos (redundante con el front, da mayor seguridad)
  upload.single('imagenPerfil'),
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
  check("nombre", "El nombre no puede contener números").matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g),
  check("apellidos", "Los apellidos no pueden contener números").matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g),
  //checkeamos que sea un email de la UCM
  check("email", "El email debe ser de la UCM").matches(/^[a-zA-Z0-9]+@ucm.es$/),
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
    datos.contrasena =  bcrypt.hashSync(req.body.contrasena,11); //encriptar contraseña
    if(req.file)
      datos.imagen = req.file.buffer; //Buffer del multer para guardar la imagen 
    datos.rol = 'usuario';
    datos.validado = false; //Siempre hay que ser validador por un Admin

    daoUsuario.buscarPorEmail(datos.email, (err, usr) => {
      if (err) {
        next(err);
      } else {  
        if(usr !== undefined){
          errors.errors.push({
            msg: 'Email duplicado',
          });
        }
        if (!errors.isEmpty()) {
          return res.render("registroUsuario", { errores: errors.array() });
        } else {
          daoUsuario.insertarUsuario(datos, (err, usr) => {
            if (err) {
              next(err);
            } else {  
              req.session.user = { email: datos.email, id: usr, nombre: datos.nombre };
              res.redirect("/");
            }
          }); 
        }
      }
    });
  }
);

router.delete("/logout", function(req, res, next) {
  req.session.destroy(function(err){
    if(!err){
        res.send("Log Out!")
        res.redirect("/");
    }
    else
      next(err);
  })
});

// Ruta para mostrar la página de usuario con EJS
router.get('/:id', (req, res, next) => {
  let datos = {};
  const id = req.params.id;
  datos.id = id; // Obtener el parámetro de la URL

  daoUsuario.buscarPorID(id, (err, usuario) => {
    if (err) {
      next(err);
    } else {
      if (usuario === undefined) { //si no se encuentra el usuario, pasamos al middleware de ruta no encontrada
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
        //TODO: falta cargar la foto

        if(req.session.user !== undefined){
          datos.session = req.session.user;
        }
        console.log(datos);
        res.render('cuentaUsuario', { datos: datos });
      }
    }
  });
});

router.get('/admin/pendientes', (req,res,next) => {
  let datos = {};
  daoUsuario.buscarNoValidados((err, usuarios) =>{
    if(err)
      next(err);
    else{
      datos.usuarios = usuarios;
      if(req.session.user !== undefined){
        datos.session = req.session.user;
      }
      res.render("pendientes" , { datos: datos });
    }
  });
});

router.put("/admin/validar/:id", (req,res,next) => {
  const id = req.params.id;
  daoUsuario.validarUsuario(id, (err) =>{
    if(err)
      next(err);
    else{
      res.send(`ID:${id} validado`);
    }
  });
});

router.get('/admin/hacerAdmin', (req,res,next) =>{
  let datos = {};
  //Ademas de ser usuario, tiene que estar validado
  //Esto lo comprueba ya la query de la BBDD
  daoUsuario.buscarRolUsuario((err,usuarios) =>{
    if(err)
      next(err);
    else{
      datos.usuarios = usuarios;
      if(req.session.user !== undefined){
        datos.session = req.session.user;
      }
      res.render("hacerAdmin" , { datos: datos });
    }
  })
});

router.put("/admin/hacerAdmin/:id", (req,res,next) =>{
  const id = req.params.id;
  daoUsuario.hacerAdmin(id, (err) =>{
    if(err)
      next(err);
    else{
      res.send(`ID:${id} ahora es Admin`);
    }
  });
});

router.get("/admin/crearInstalacion", (req,res,next) =>{
  res.status(200);
  res.render("crearInstalacion", { errores: {} });
});

module.exports = router;
