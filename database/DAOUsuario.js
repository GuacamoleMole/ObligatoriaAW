"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD

class DAOUsuario {
    pool;

    constructor() {
        this.pool = db.getPool();
    }

    insertarUsuario (usr,callback){
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err)
            } else {
                connection.query(
                    //TODO Imagen BLOB
                    `INSERT INTO  UCM_AW_RIU_USU_Usuarios(nombre,apellidos,facultad,email,contraseña,curso,grupo,rol)
                    VALUES (?,?,?,?,?,?,?,?)`,
                    [usr.nombre,usr.apellidos,usr.facultad,usr.email,usr.contrasena,usr.curso,usr.grupo,usr.rol],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback(err,null);
                        }
                        else{
                            callback(null,rows.insertId) //devolvemos el id devulto por la BD
                        }
                    }
                )
            }
        });
    }

    terminarConexion(callback) {
        this.pool.end();
    }
}

module.exports = DAODestino;