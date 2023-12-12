"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD
const confQueries = require("./queries/confQueries");

class DAOConfiguracion {
  pool;

  constructor() {
    this.pool = db.getPool();
  }

  nuevaConf(conf, callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          confQueries.nuevaConf,
          [conf.nombre, conf.calle, conf.ciudad, conf.pais, conf.logo],
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

  elimiarConf(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          confQueries.elimiarConf,
          function (err, rows) {
            connection.release();
            if (err) {
              callback(err, null);
            } else {
              callback(null, rows.affectedRows); //devolvemos el id devulto por la BD
            }
          }
        );
      }
    });
  }
  buscarConf(callback) {
    this.pool.getConnection((err, connection) => {
      if (err) {
        callback(err);
      } else {
        connection.query(
          confQueries.buscarConf,
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

module.exports = DAOConfiguracion;
