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
      //Si no existe el destino URL va a el middleware de rutas no encontrada
      if(inst === undefined)
        next();
      let datos = {};
      if(req.session.user !== undefined){
        datos.session = req.session.user;
      }
      datos.conf = req.app.locals.configuracion
      datos.inst = inst;
      datos.idInstalacion = id;
      res.render("instalacion", {datos, errores: {}, exitoReserva: false});
    }
  });  
});

router.post(
  "/crear", 
  upload.single('imagenInstalacion'),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("descripcion", "La descripción es obligatoria").notEmpty(),
  check("tipoReserva", "El tipo de reserva es obligatorio").notEmpty(),
  check("horaInicio", "La hora de inicio es obligatoria").notEmpty(),
  check("horaFin", "La hora de fin es obligatoria").notEmpty(),
  check("aforo", "El aforo es obligatorio").notEmpty(),
  body('imagenInstalacion').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('La imagen de la instalación es obligatoria');
    }
    return true;
  }),
  check('horaInicio').custom((value, { req }) => {

    let horaInicio = value.split(":");
    let horaFin = req.body.horaFin.split(":");
    
    if (horaInicio[0] < horaFin[0]) {
      return true;
    } else {
      throw new Error("La hora de inicio ha de ser inferior a la hora de fin");
    }
  }),
  (req,res,next) =>{
    let datos = {};
    if(req.session.user !== undefined){
      datos.session = req.session.user;
    }
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("crearInstalacion", { datos: datos, errores: errors.array(), exitoReserva: false });
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
