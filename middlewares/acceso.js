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
    soloAdmin
};