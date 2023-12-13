const { Router } = require('express');
const DAOMensajes = require('../database/DAOMensajes')
const daoMensajes = new DAOMensajes();
const DAOUsuario = require('../database/DAOUsuario')
const daoUsuario = new DAOUsuario();
const router = Router();

//Ruta página instalación, donde se muestra la instalación en detalle y se permite reservarla
router.get("/:id", function(req, res, next) {
  datos = {};
  const id = req.params.id;
  datos.id = id;

  daoMensajes.mensajesRecibidos(id, (err, mensajes) => {
    if (err) {
        next(err);
    } else {
      if (mensajes === undefined) {
          next();
      } else {
          datos.mensajes = mensajes;
          console.log(datos.mensajes);
      }

      daoUsuario.buscarValidados((err, usuarios) => {
          if (err) {
              next(err);
          } else {
              if (usuarios === undefined) {
                  next();
              } else {
                  datos.usuariosOrganizacion = usuarios;
                  const facultad = req.session.user.facultad;
                  daoUsuario.buscarValidadosPorFacultad(facultad, (err, usuariosFac) => {
                      if (err) {
                          next(err);
                      } else {
                          if (usuariosFac === undefined) {
                              next();
                          } else {
                              datos.usuariosFacultad = usuariosFac;
                          }
                          if(req.session.user !== undefined) {
                              datos.session = req.session.user;
                          }
                          res.status(200);
                          res.render("mensajes", {datos});
                      }
                  });
              }
          }
      });
    }
  });
});

router.post("/enviarFacultad", function(req, res, next) {
  const idOrigen = req.session.user.id;
  const emailDestino = req.body.emailDestinatarioFacultad;
  const mensaje = req.body.mensajeFacultad;
  const asunto = req.body.asuntoFacultad;

  daoUsuario.buscarPorEmail(emailDestino, (err, usuario) => {
    if (err) {
      next(err);
    } else {
      if (usuario === undefined) {
        next();
      } else {
        const idDestino = usuario.id;
        daoMensajes.enviarMensaje({idOrigen, idDestino, mensaje, asunto}, (err, id) => {
          if (err) {
            next(err);
          } else {
            res.redirect("/mensajes/" + idOrigen);
          }
        });
      }
    }
  });
});

router.post("/enviarOrganizacion", function(req, res, next) {
  const idOrigen = req.session.user.id;
  const emailDestino = req.body.emailDestinatarioOrganizacion;
  const mensaje = req.body.mensajeOrganizacion;
  const asunto = req.body.asuntoOrganizacion;

  daoUsuario.buscarPorEmail(emailDestino, (err, usuario) => {
    if (err) {
      next(err);
    } else {
      if (usuario === undefined) {
        next();
      } else {
        const idDestino = usuario.id;
        daoMensajes.enviarMensaje({idOrigen, idDestino, mensaje, asunto}, (err, id) => {
          if (err) {
            next(err);
          } else {
            res.redirect("/mensajes/" + idOrigen);
          }
        });
      }
    }
  });
});


module.exports = router;