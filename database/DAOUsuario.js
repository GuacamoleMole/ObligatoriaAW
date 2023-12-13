"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const usuQueries = require("./queries/usuQueries");

class DAOUsuario {
  pool;

  constructor() {
    this.pool = db.getPool();
  }

  insertarUsuario(usr, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          usuQueries.insertarUsuario,
          [
            usr.nombre,
            usr.apellidos,
            usr.facultad,
            usr.email,
            usr.contrasena,
            usr.curso,
            usr.grupo,
            usr.imagen,
            usr.rol,
            usr.validado,
          ],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(err, null);
            } else {
              callback(null, rows.insertId); //devolvemos el id devulto por la BD
            }
          }
        );
      }
    });
  }

  buscarPorEmail(eml, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          usuQueries.buscarPorEmail,
          [eml],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(err, null);
            } else {
              let data = JSON.parse(JSON.stringify(rows));
              callback(null, data[0]); //devolvemos solo uno, ya que email es UNIQUE
            }
          }
        );
      }
    });
  }
  buscarRolUsuario(callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(usuQueries.buscarRolUsuario, function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data); //devolvemos todos los roles usuarios
          }
        });
      }
    });
  }

  buscarPorID(id, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(usuQueries.buscarPorID, [id], function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data[0]); //devolvemos el usuario encontrado
          }
        });
      }
    });
  }

  buscarNoValidados(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(usuQueries.buscarNoValidados, function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data); //devolvemos todos los no validados
          }
        });
      }
    });
  }

  buscarValidados(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(usuQueries.buscarValidados, function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data); //devolvemos todos los no validados
          }
        });
      }
    });
  }

  buscarValidadosPorFacultad(facultad, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(usuQueries.buscarValidadosPorFacultad, [facultad], function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data); //devolvemos todos los no validados
          }
        });
      }
    });
  }

  validarUsuario(id, callback){
    this.pool.getConnection((err, connection) => {
      if(err)
        callback(err);
      else{
        connection.query(usuQueries.validarUsuario, [id], function(err, rows){
          connection.release();
          //Como solo se modifica una fila, no devolvemos nada en rows
          if(err)
            callback(err)
          else
            callback(null);
        });
      }
    });
  }

  hacerAdmin(id, callback){
    this.pool.getConnection((err, connection) => {
      if(err)
        callback(err);
      else{
        connection.query(usuQueries.hacerAdmin, [id], function(err, rows){
          connection.release();
          //Como solo se modifica una fila, no devolvemos nada en rows
          if(err)
            callback(err)
          else
            callback(null);
        });
      }
    });
  }
  terminarConexion(callback) {
    this.pool.end();
  }
}

module.exports = DAOUsuario;
