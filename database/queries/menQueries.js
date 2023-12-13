"use strict";

module.exports = {
  enviarMensaje: `INSERT INTO UCM_AW_RIU_MEN_Mensajes(id_origen, id_dest, contenido, asunto)
  VALUES (?,?,?,?)`,

  mensajesRecibidos: 'SELECT  USU.email, USU.nombre, USU.apellidos, MEN.contenido, MEN.asunto FROM UCM_AW_RIU_MEN_Mensajes MEN JOIN UCM_AW_RIU_USU_Usuarios USU ON MEN.id_origen = USU.id WHERE MEN.id_dest = ?',
  
};
  