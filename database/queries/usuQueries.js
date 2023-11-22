"use strict";

module.exports = {
  //TODO Imagen BLOB
  insertarUsuario: `INSERT INTO  UCM_AW_RIU_USU_Usuarios(nombre,apellidos,facultad,email,contraseña,curso,grupo,foto,rol,validado)
  VALUES (?,?,?,?,?,?,?,?,?,?)`,

  buscarPorEmail: 'SELECT * FROM UCM_AW_RIU_USU_Usuarios WHERE email = ?',
};
  