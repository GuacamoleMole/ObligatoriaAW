$(document).ready(function () {
    const botonNuevoMensaje = $("#botonNuevoMensaje");
    const modalNuevoMensaje = $("#modalNuevoMensaje");

    botonNuevoMensaje.on('click', () => {
        modalNuevoMensaje.modal("show");
    });
});