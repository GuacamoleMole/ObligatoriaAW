"use strict";

module.exports = {
  enviarMensaje: `INSERT INTO UCM_AW_RIU_MEN_Mensajes(id_origen, id_dest, contenido, asunto)
  VALUES (?,?,?,?)`,

  //TODO no se si estan bien las queries
  mensajesRecibidios: 'SELECT  USU.email, MEN.contenido, MEN.asunto FROM UCM_AW_RIU_MEN_Mensajes MEN JOIN UCM_AW_RIU_USU_Usuarios USU ON MEN.id_origen = USU.id WHERE MEN.id_dest = ?',

  mensajesEnviados: 'SELECT  USU.email, MEN.contenido, MEN.asunto FROM UCM_AW_RIU_MEN_Mensajes MEN JOIN UCM_AW_RIU_USU_Usuarios USU ON MEN.id_dest = USU.id WHERE MEN.id_origen = ?',
  
};
  