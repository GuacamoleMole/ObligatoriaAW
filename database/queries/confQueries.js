"use strict";

module.exports = {
    nuevaConf: `INSERT INTO UCM_AW_RIU_CON_Configuracion(nombre, calle, ciudad, pais, logo)
    VALUES (?,?,?,?,?)`,
    
    elimiarConf : `DELETE FROM UCM_AW_RIU_CON_Configuracion`,

    buscarConf: `SELECT * FROM UCM_AW_RIU_CON_Configuracion`

  };
    