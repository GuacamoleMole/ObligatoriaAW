const { Router } = require('express');
const DAOMensajes = require('../database/DAOMensajes')
const daoMensajes = new DAOMensajes();
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
        }
        if(req.session.user !== undefined){
            datos.session = req.session.user;
        }
        res.status(200);
        res.render("mensajes", {datos});
    }
  });
});


module.exports = router;