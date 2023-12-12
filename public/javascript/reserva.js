$(document).ready(() => {
    const botonCrearReserva = $('.botonCrearReserva')
    const formularioReserva = $('#formularioReserva');
    const ajaxForm = $('#ajaxForm');

    formularioReserva.hide();

    botonCrearReserva.on('click', () => {
        const url = window.location.href;
        const ultimoSlash = url.lastIndexOf('/');
        const idDestino = parseInt(url.substring(ultimoSlash + 1),10);
        botonCrearReserva.hide();
        formularioReserva.toggle();
    });

    ajaxForm.submit(function (event) {
        event.preventDefault();
        const formData = ajaxForm.serialize();
        console.log(formData);
    })
});