$(document).ready(() => {
    const botonCrearReserva = $('.botonCrearReserva')
    const formularioReserva = $('#formularioReserva');

    formularioReserva.hide();

    botonCrearReserva.on('click', () => {
        const url = window.location.href;
        const ultimoSlash = url.lastIndexOf('/');
        const idDestino = parseInt(url.substring(ultimoSlash + 1),10);
        botonCrearReserva.hide();
        formularioReserva.toggle();
    });

});