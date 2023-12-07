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
router.get("/:id", function(req, res) {
  datos = {};
  const id = req.params.id;
  datos.id = id;
  
  if(req.session.user !== undefined){
    datos.session = req.session.user;
  }
  
  res.status(200);
  // TODO: buscar el id y pasar el nombre e información de la instalación
  res.render("instalacion", {id});
});

//TODO: mas checks
router.post(
  "/crear", 
  upload.single('imagenPerfil'),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  (req,res,next) =>{
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("crearInstalacion", { errores: errors.array() });
    }
    // Si no hay errores, recogemos los datos del formulario
    let datos = {};
    datos.nombre = req.body.nombre;
    datos.tipo = req.body.tipoReserva;
    datos.horaInicio = req.body.horaInicio;
    datos.horaFin = req.body.horaFin;
    datos.aforo = req.body.aforo;
    if(req.file)
      datos.imagen = req.file.buffer; //Buffer del multer para guardar la imagen 
    console.log(datos);
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
          return res.render("crearInstalacion", { errores: errors.array() });
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
