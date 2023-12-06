"use strict";

module.exports = {
  insertarUsuario: `INSERT INTO  UCM_AW_RIU_USU_Usuarios(nombre,apellidos,facultad,email,contraseña,curso,grupo,foto,rol,validado)
  VALUES (?,?,?,?,?,?,?,?,?,?)`,

  buscarPorEmail: 'SELECT * FROM UCM_AW_RIU_USU_Usuarios WHERE email = ?',

  buscarPorID: 'SELECT * FROM UCM_AW_RIU_USU_Usuarios WHERE id = ?',

  buscarNoValidados: 'SELECT * FROM UCM_AW_RIU_USU_Usuarios WHERE validado = 0',

  buscarRolUsuario: 'SELECT * FROM UCM_AW_RIU_USU_Usuarios WHERE rol = "usuario" AND validado = 1',

  validarUsuario: 'UPDATE UCM_AW_RIU_USU_Usuarios SET validado = 1 WHERE id = ?',

  hacerAdmin: 'UPDATE UCM_AW_RIU_USU_Usuarios SET rol = "admin" WHERE id = ? '
};
  