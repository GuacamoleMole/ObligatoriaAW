"use strict";

module.exports = {
  insertarReserva: `INSERT INTO  UCM_AW_RIU_RES_Reservas(id_usuario, id_instalacion, fecha, hora_inicio, hora_fin)
  VALUES (?,?,?,?,?)`,

  buscarTodas: 'SELECT * FROM UCM_AW_RIU_RES_Reservas',

  // Obtener toda la información de las reservas, pasándole el id de usuario y de instalación, haciendo joins con las tablas de usuario e instalacion
  obtenerTodaInformacionReservas: 'SELECT res.fecha, res.hora_inicio, res.hora_fin, us.nombre, us.apellidos, us.email, us.facultad, ins.nombre as instalacion FROM UCM_AW_RIU_RES_Reservas res JOIN UCM_AW_RIU_USU_Usuarios us ON res.id_usuario = us.id JOIN UCM_AW_RIU_INS_Instalaciones ins ON res.id_instalacion = ins.id',
  // Lo mismo que la anterior pero especificando el ID del usuario del que se quieren sacar las reservas
  obtenerTodaInformacionReservasPorID: 'SELECT res.id, res.fecha, res.hora_inicio, res.hora_fin, ins.nombre FROM UCM_AW_RIU_RES_Reservas res  JOIN UCM_AW_RIU_INS_Instalaciones ins ON res.id_instalacion = ins.id WHERE res.id_usuario = ?',

  eliminarReserva: 'DELETE FROM UCM_AW_RIU_RES_Reservas WHERE id = ?',
};
  