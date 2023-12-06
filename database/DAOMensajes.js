"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const menQueries = require("./queries/menQueries");

class DAOMensajes {
  pool;

  constructor() {
    this.pool = db.getPool();
  }

  enviarMensaje(men, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          menQueries.enviarMensaje,
          [men.idOrigen, men.idDestino, men.mensaje, men.asunto],
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

  mensajesRecibidos(id, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          menQueries.mensajesRecibidos,
          [id],
          function (err, rows) {
            connection.release();
            if (err) {
              callback(err, null);
            } else {
              let data = JSON.parse(JSON.stringify(rows));
              callback(null, data); //devolvemos los mensajes encontrados
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

module.exports = DAOMensajes;
