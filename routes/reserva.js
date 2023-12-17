const {Router} = require('express');
const { check, validationResult } = require("express-validator");
const DAOReservas = require('../database/DAOReservas')
const daoReservas = new DAOReservas();
const DAOInstalaciones = require('../database/DAOInstalaciones')
const daoInstalaciones = new DAOInstalaciones();
const router = Router();
const { verificarAutenticacion, soloAdmin,actualizarSession } = require('../middlewares/acceso');

router.post(
    "/crear",
    check("fecha").custom((fecha) => {
        const fechaIntroducida = new Date(fecha);
        const hoy = new Date();
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

                let errors = validationResult(req);
             
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
                const reservaIni = parseInt(reserva.horaInicio.split(':')[0], 10);
                const reservaFin = parseInt(reserva.horaFin.split(':')[0], 10);
                const instIni = parseInt(inst.hora_inicio.split(':')[0], 10);
                const instFin = parseInt(inst.hora_fin.split(':')[0], 10);
                if (!(reservaIni >= instIni && reservaFin <= instFin)){
                  errors.errors.push({
                    msg: "La reserva debe ser realizada en el horario disponible",
                  });
                }
                if (!errors.isEmpty()) {
                  return res.render("instalacion", { datos, errores: errors.array(), exitoReserva: false });
              }
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

router.get("/busqueda", verificarAutenticacion, actualizarSession, soloAdmin, (req,res,next) =>{
  const filtros = req.query;
  let sql = `
    SELECT USU.nombre, USU.apellidos, USU.email, INS.nombre AS instalacion, RES.fecha, USU.facultad, RES.hora_inicio, RES.hora_fin 
    FROM UCM_AW_RIU_RES_Reservas RES
    JOIN UCM_AW_RIU_INS_Instalaciones INS ON RES.id_instalacion = INS.id
    JOIN UCM_AW_RIU_USU_Usuarios USU ON RES.id_usuario = USU.id
    WHERE 1=1`;
  if(filtros.facultad !== 'todos'){
    sql += ` AND USU.facultad = '${filtros.facultad}'`;
  }
  if (filtros.instalacion !== 'todos')
  {
    sql += ` AND INS.nombre = '${filtros.instalacion}'`;
  }
  if(filtros.email !== undefined)
  {
    sql += ` AND USU.email LIKE '%${filtros.email}%'`;
  }
  if(filtros.horaInicio !== undefined)
  {
    sql += ` AND RES.hora_inicio = TIME('${filtros.horaInicio}')`;
  }
  if(filtros.horaFin !== undefined)
  {
    sql += ` AND RES.hora_fin = TIME('${filtros.horaFin}')`;
  }
  if(filtros.fecha !== undefined)
  {
    sql += ` AND RES.fecha = '${filtros.fecha}'`;
  }
  let datos = {};
  daoReservas.busquedaAvanzada(sql, (err, result) =>{
    if(err){
      next(err);
    }else{
      datos.reservas = result;
      for (let i = 0; i < datos.reservas.length; i++) {
        datos.reservas[i].fecha = new Date(
          datos.reservas[i].fecha
        ).toLocaleDateString();
      }
      res.render("busquedaReservas", { datos });
    }
  });
});

router.delete("/:id", function (req, res, next) {
  id = req.params.id;
  daoReservas.eliminarReserva(id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = router;
