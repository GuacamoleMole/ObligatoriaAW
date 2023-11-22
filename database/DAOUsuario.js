"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const usuQueries = require("./queries/usuQueries")

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
                    usuQueries.insertarUsuario,
                    [usr.nombre,usr.apellidos,usr.facultad,usr.email,usr.contrasena,usr.curso,usr.grupo,usr.foto,usr.rol,usr.validado],
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

    buscarPorEmail (eml,callback){
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err)
            } else {
                connection.query(
                    usuQueries.buscarPorEmail,
                    [eml],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback(err,null);
                        }
                        else{
                            let data = JSON.parse(JSON.stringify(rows));
                            callback(null, data[0]); //devolvemos solo uno, ya que email es UNIQUE
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

module.exports = DAOUsuario;