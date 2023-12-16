const DAOUsuario = require("../database/DAOUsuario");
const daoUsuario = new DAOUsuario();

function actualizarSession(req, res, next)
{
  if (req.session && req.session.user) {
    // Si está autenticado, permite el paso al siguiente middleware o ruta
    // Ademas actualizamos sus parametros
    daoUsuario.buscarPorEmail(req.session.user.email, (err, usr) => {
      if (err) {
        next(err);
      } else {
        req.session.user = { email: usr.email, id: usr.id, nombre: usr.nombre, facultad: usr.facultad, rol: usr.rol, validado: usr.validado };
        return next();
      }
    });
  } else {
    return next();
  }
}

// Middleware para verificar la autenticación del usuario
function verificarAutenticacion(req, res, next) {
    // Comprueba si el usuario está autenticado
    if (req.session && req.session.user) {
      // Si está autenticado, permite el paso al siguiente middleware o ruta
      return next();
    } else {
      const error = new Error("No estas registrado");
      error.status = 401;
      next(error);
    }
}

// Comprueba si el usuario es admin
function soloAdmin(req, res, next) {
    // Comprueba si el usuario está autenticado
    if (req.session.user.rol == 'admin') {
      return next();
    } else {
      const error = new Error("Acceso Denegado");
      error.status = 401;
      next(error);
    }
}

module.exports = {
    verificarAutenticacion,
    soloAdmin,
    actualizarSession
};