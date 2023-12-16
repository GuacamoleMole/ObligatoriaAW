$(document).ready(function() {

    // Manejar el clic en el botón de validar
    $('.btn-validar').on('click', function() {
        const userId = $(this).data('userid');  // Obtener el ID del usuario desde el atributo data-userid
        const url = `/usuario/admin/validar/${userId}`;

        // Realizar la llamada AJAX con jQuery
        $.ajax({
            url: url,
            type: 'PUT',
            contentType: 'application/json',
            success: function(data) {
                console.log('Respuesta del servidor:', data);
                window.location.href = "/usuario/admin/pendientes";

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error en la llamada AJAX:', textStatus, errorThrown);
            }
        });
    });

    $('.btnIdHacerAdmin').on('click', function() {
        const userId = $(this).data('userid');
        // Asignar el userId al modal
        $('#modalConfirmar').data('userid', userId);
    });

    // Manejar el clic en el botón de validar
    $('.btn-hacerAdmin').on('click', function() {
        const userId = $('#modalConfirmar').data('userid');
        const url = `/usuario/admin/hacerAdmin/${userId}`;

        // Realizar la llamada AJAX con jQuery
        $.ajax({
            url: url,
            type: 'PUT',
            contentType: 'application/json',
            success: function(data) {
                console.log('Respuesta del servidor:', data);
                window.location.href = "/usuario/admin/hacerAdmin";

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error en la llamada AJAX:', textStatus, errorThrown);
            }
        });
    });

});
