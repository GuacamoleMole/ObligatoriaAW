const {Router} = require('express');
const router = Router();

//Ruta página instalación, donde se muestra la instalación en detalle y se permite reservarla
router.get("/:id", function(req, res) {
  const id = req.params.id;
  res.status(200);
  // TODO: buscar el id y pasar el nombre e información de la instalación
  res.render("instalacion", {id});
});


module.exports = router;
