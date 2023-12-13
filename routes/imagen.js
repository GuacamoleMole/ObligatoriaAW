"use strict";

const { Router, response } = require("express");
const DAOImagen = require("../database/DAOImagen");
const daoImagen = new DAOImagen();
const router = Router();

router.get("/instalacion/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const error = new Error("Petición incorrecta");
    error.status = 404;
    next(error);
  } else {
    daoImagen.obtenerImagenInstalacion(id, (err, img) => {
      if (err) {
        next(err);
      } else {
        const imageBuffer = Buffer.from(img.imagen.data);
        res.end(imageBuffer);
      }
    });
  }
});

router.get("/usuario/:id", (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      const error = new Error("Petición incorrecta");
      error.status = 404;
      next(error);
    } else {
      daoImagen.obtenerImagenUsuario(id, (err, img) => {
        if (err) {
          next(err);
        } else {
          const imageBuffer = Buffer.from(img.foto.data);
          res.end(imageBuffer);
        }
      });
    }
});
  

router.get("/logo", (req, res, next) => {
  daoImagen.obtenerLogo((err, img) => {
    if (err) {
      next(err);
    } else {
      const imageBuffer = Buffer.from(img.logo.data);
      res.end(imageBuffer);
    }
  });
});

module.exports = router;
