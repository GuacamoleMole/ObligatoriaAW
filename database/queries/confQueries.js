"use strict";

module.exports = {
    nuevaConf: `INSERT INTO UCM_AW_RIU_CON_Configuracion(nombre, calle, ciudad, pais, logo)
    VALUES (?,?,?,?,?)`,

    cambiarConf: 'UPDATE UCM_AW_RIU_CON_Configuracion SET nombre = ?, calle = ?, ciudad = ?, pais = ?, logo = ? WHERE id = 0',

    buscarConf: `SELECT * FROM UCM_AW_RIU_CON_Configuracion`
};
    