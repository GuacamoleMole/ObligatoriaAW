"use strict";

module.exports = {
  insertarInstalación: `INSERT INTO UCM_AW_RIU_INS_Instalaciones(nombre, aforo, tipoReserva, imagen, hora_inicio, hora_fin, descripcion)
  VALUES (?,?,?,?,?,?,?)`,

  buscarPorNombre: 'SELECT * FROM UCM_AW_RIU_INS_Instalaciones WHERE nombre = ?',
  
  buscarPorId : 'SELECT * FROM UCM_AW_RIU_INS_Instalaciones WHERE id = ?',

  buscarTodas: 'SELECT * FROM UCM_AW_RIU_INS_Instalaciones',
};
  