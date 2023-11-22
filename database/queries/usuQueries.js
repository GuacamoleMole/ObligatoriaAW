"use strict";

module.exports = {
  insertarUsuario: `INSERT INTO  UCM_AW_RIU_USU_Usuarios(nombre,apellidos,facultad,email,contraseña,curso,grupo,foto,rol,validado)
  VALUES (?,?,?,?,?,?,?,?,?,?)`,

  buscarPorEmail: 'SELECT * FROM UCM_AW_RIU_USU_Usuarios WHERE email = ?',

  validarUsuario: 'UPDATE UCM_AW_RIU_USU_Usuarios SET validado = 1 WHERE email = ?',

  hacerAdmin: 'UPDATE UCM_AW_RIU_USU_Usuarios SET rol = "Admin" WHERE email = ?'
};
  