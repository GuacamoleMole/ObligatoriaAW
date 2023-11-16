"use strict";
const db = require("./configuration"); // Info de la conexion con la BBDD

class DAOSession {
    pool;

    constructor() {
        this.pool = db.getPool();
    }

    terminarConexion(callback) {
        this.pool.end();
    }
}

module.exports = DAODestino;