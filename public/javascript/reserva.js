$(document).ready(function() {

    $('.btnIdReserva').on('click', function() {
        const reservaId = $(this).data('reservaid');
        const userId = $(this).data('userid');
        // Asignar el reservaId al modal
        $('#modalConfirmar').data('reservaid', reservaId);
        $('#modalConfirmar').data('userId', userId);
    });

    // Manejar el clic en el botón de validar
    $('#btnCancelarReserva').on('click', function() {
        const reservaId = $('#modalConfirmar').data('reservaid');
        const userId = $('#modalConfirmar').data('userId');
        const url = `/reserva/${reservaId}`;
        console.log(url); 

        // Realizar la llamada AJAX con jQuery
        $.ajax({
            url: url,
            type: 'DELETE',
            contentType: 'application/json',
            success: function(data) {
                console.log('Respuesta del servidor:', data);
                window.location.href = `/usuario/${userId}/reservas`;

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error en la llamada AJAX:', textStatus, errorThrown);
            }
        });
    });

});