"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const reservasQueries = require("./queries/reservasQueries");

class DAOReservas {
  pool;

  constructor() {
    this.pool = db.getPool();
  }

  realizarReserva(res, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          reservasQueries.insertarReserva,
          [res.idUsuario, res.idInstalacion, res.fecha, res.horaInicio, res.horaFin],
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

  terminarConexion(callback) {
    this.pool.end();
  }
}

module.exports = DAOReservas;
