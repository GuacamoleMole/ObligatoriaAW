"use strict";

module.exports = {
    obtenerImagenInstalacion: 'SELECT imagen FROM UCM_AW_RIU_INS_Instalaciones WHERE id = ?',
    obtenerImagenUsuario: 'SELECT foto FROM UCM_AW_RIU_USU_Usuarios WHERE id = ?',
    obtenerLogo: 'SELECT logo FROM UCM_AW_RIU_CON_Configuracion WHERE id = 0'
}