"use strict";

const {Router} = require('express');
const router = Router();
const DAOInstalaciones = require('../database/DAOInstalaciones')
const daoInstalaciones = new DAOInstalaciones();
const multer = require("multer");
const { body, check, validationResult } = require("express-validator");
const storage = multer.memoryStorage(); // Almacenar los datos en memoria en lugar de en archivos
const upload = multer({ storage: storage });


//Ruta página instalación, donde se muestra la instalación en detalle y se permite reservarla
router.get("/:id", function(req, res, next) {
  const id = req.params.id;
  
  daoInstalaciones.buscarPorId(id, (err,inst) =>{
    if(err){
      next(err);
    } else{
      if(req.session.user !== undefined){
        inst.session = req.session.user;
      }
      console.log(inst);
      res.render("instalacion", {datos: inst});
    }
  });  
});

//TODO: mas checks
router.post(
  "/crear", 
  upload.single('imagenPerfil'),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  (req,res,next) =>{
    let datos = {};
    if(req.session.user !== undefined){
      datos.session = req.session.user;
    }
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("crearInstalacion", { datos: datos, errores: errors.array() });
    }
    // Si no hay errores, recogemos los datos del formulario
    datos.nombre = req.body.nombre;
    datos.tipo = req.body.tipoReserva;
    datos.horaInicio = req.body.horaInicio;
    datos.horaFin = req.body.horaFin;
    datos.aforo = req.body.aforo;
    datos.descripcion = req.body.descripcion;
    if(req.file)
      datos.imagen = req.file.buffer; //Buffer del multer para guardar la imagen 
    daoInstalaciones.buscarPorNombre(datos.nombre, (err, inst) =>{
      if(err){
        next(err);
      } else{
        if(inst !== undefined){
          errors.errors.push({
            msg: 'Nombre ya existe, tiene que ser único',
          });
        }
        if (!errors.isEmpty()) {
          return res.render("crearInstalacion", { datos: datos, errores: errors.array() });
        } else {
          daoInstalaciones.insertarInstalación(datos, (err, id) =>{
            if (err) {
              next(err);
            } else {  
              res.redirect("/");
            }
          });
        }
      }
    })
});

module.exports = router;
