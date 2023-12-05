$(document).ready(function () {
    const botonNuevoMensaje = $("#botonNuevoMensaje");
    const modalNuevoMensaje = $("#modalNuevoMensaje");

    botonNuevoMensaje.on('click', () => {
        let modal = new bootstrap.Modal(modalNuevoMensaje);
        modal.show();
    });
});