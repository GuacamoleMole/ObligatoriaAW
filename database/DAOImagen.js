"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const imgQueries = require("./queries/imgQueries");

class DAOImagen {
  pool;

  constructor() {
    this.pool = db.getPool();
  }

  obtenerImagenInstalacion(id, callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          imgQueries.obtenerImagenInstalacion,
          [id],
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

  obtenerImagenUsuario(id, callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          imgQueries.obtenerImagenUsuario,
          [id],
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

  obtenerLogo(callback){
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          imgQueries.obtenerLogo,
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

  terminarConexion(callback) {
    this.pool.end();
  }
}

module.exports = DAOImagen;
