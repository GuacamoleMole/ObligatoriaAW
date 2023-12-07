"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const insQueries = require("./queries/insQueries");

class DAOInstalaciones {
  pool;

  constructor() {
    this.pool = db.getPool();
  }

  insertarInstalación(inst, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          insQueries.insertarInstalación,
          [inst.nombre, inst.aforo, inst.tipo, inst.imagen, inst.horaInicio, inst.horaFin],
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

  buscarPorNombre(nombre, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          insQueries.buscarPorNombre,
          [nombre],
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

  buscarTodasInstalaciones(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(insQueries.buscarTodas, function (err, rows) {
          connection.release();
          if (err) {
            callback(err, null);
          } else {
            let data = JSON.parse(JSON.stringify(rows));
            callback(null, data); // devolvemos todas las filas
          }
        });
      }
    });
  }

  terminarConexion(callback) {
    this.pool.end();
  }
}

module.exports = DAOInstalaciones;
