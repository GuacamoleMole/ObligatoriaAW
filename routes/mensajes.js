const { Router } = require('express');
const router = Router();

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
  res.render("mensajes", {id});
});


module.exports = router;