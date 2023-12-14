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

  buscarTodasReservas(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(reservasQueries.buscarTodas, function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data);
          }
        });
      }
    });
  }

  // Obtener toda la información de las reservas, pasándole el id de usuario y de instalación, haciendo joins con las tablas de usuario e instalacion
  obtenerTodaInformacionReservas(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(reservasQueries.obtenerTodaInformacionReservas, function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data);
          }
        });
      }
    });
  }

  obtenerTodaInformacionReservasPorID(id, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(reservasQueries.obtenerTodaInformacionReservasPorID,
          [id],
          function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data);
          }
        });
      }
    });
  }

  terminarConexion(callback) {
    this.pool.end();
  }
}

module.exports = DAOReservas;
