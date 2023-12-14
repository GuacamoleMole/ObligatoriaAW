const {Router} = require('express');
const { check, validationResult } = require("express-validator");
const DAOReservas = require('../database/DAOReservas')
const daoReservas = new DAOReservas();
const DAOInstalaciones = require('../database/DAOInstalaciones')
const daoInstalaciones = new DAOInstalaciones();
const router = Router();

router.post(
    "/crear",
    check("fecha").custom((fecha) => {
        const fechaIntroducida = new Date(fecha);
        const hoy = new Date();
        console.log(fechaIntroducida)
        console.log(hoy);
        // Compare the selected date with today's date
        if (fechaIntroducida < hoy) {
          throw new Error('La fecha seleccionada debe ser para mañana o posterior');
        }
    
        return true;
      }),
      check("horaInicio").custom((value, { req }) => {

        let horaInicio = value.split(":");
        let horaFin = req.body.horaFin.split(":");
        
        if (horaInicio[0] < horaFin[0]) {
          return true;
        } else {
          throw new Error("La hora de inicio ha de ser inferior a la hora de fin");
        }
      }),
      (req,res,next) => {
        let datos = {};
        if(req.session.user !== undefined){
            datos.session = req.session.user;
        }
        datos.conf = req.app.locals.configuracion

        let idInstalacion = req.body.idInstalacion;

        daoInstalaciones.buscarPorId(idInstalacion, (err,inst) => {
            if(err){
                next(err);
            } else{
                datos.inst = inst;
                datos.idInstalacion = idInstalacion;
              
                console.log(reserva);
                console.log(datos);

                let errors = validationResult(req);
                if (usr !== undefined) {
                  errors.errors.push({
                    msg: "La reserva debe ser realizada en el horario disponible",
                  });
                }
                if (!errors.isEmpty()) {
                    return res.render("instalacion", { datos, errores: errors.array(), exitoReserva: false });
                }
        
                // Si no hay errores, recogemos los datos del formulario
                let reserva = {};
                reserva.idUsuario = req.session.user.id;
                reserva.idInstalacion = idInstalacion;
                reserva.fecha = req.body.fecha;
                reserva.horaInicio = req.body.horaInicio;
                reserva.horaFin = req.body.horaFin;
                datos.res = reserva;

                daoReservas.realizarReserva(reserva, (err, idRes) => {
                    if (err) {
                        next(err);
                    } else {
                        return res.render("instalacion", { datos, errores: {}, exitoReserva: true });
                    }
                })
            }
        });  
      });

module.exports = router;
