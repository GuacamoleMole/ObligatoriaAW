$(document).ready(function () {
    // Función para filtrar dependiendo de nombre y apellidos
    function filterResults() {
        let facultadFilter = $('#facultad').val().toLowerCase();
        let instalacionFilter = $('#instalacion').val().toLowerCase();
        let emailFilter = $('#email').val().toLowerCase();
        let horaInicioFilter = $('#horaInicio').val();
        let horaFinFilter = $('#horaFin').val();
        let fechaFilter = $('#fecha').val();
        fechaFilter = new Date(fechaFilter).toLocaleDateString();

        $('.resultadoBusqueda').each(function () {
            let facultad = $(this).find('.campoUsuarioFacultad').text().toLowerCase();
            let instalacion = $(this).find('.campoUsuarioInstalacion').text().toLowerCase();
            let email = $(this).find('.campoUsuarioEmail').text().toLowerCase();
            let horaInicio = $(this).find('.campoUsuarioHoraInicio').text();
            let horaFin = $(this).find('.campoUsuarioHoraFin').text();
            let fecha = $(this).find('.campoUsuarioFecha').text();

            // Comprobar si el item actual coincide con los criterios de filtrado
            if ((instalacion.indexOf(instalacionFilter) > -1 || instalacionFilter === 'todas') &&
                (email.indexOf(emailFilter) > -1 || emailFilter === '') &&
                (facultad.indexOf(facultadFilter) > -1 || facultadFilter === 'todos') &&
                (horaInicio.indexOf(horaInicioFilter) > -1 || horaInicioFilter === '') &&
                (horaFin.indexOf(horaFinFilter) > -1 || horaFinFilter === '') &&
                (fecha.indexOf(fechaFilter) > -1 || fechaFilter === '' || fechaFilter == 'Invalid Date')) {
                $(this).parent().show(); // Enseñar el resultado si coincide
            } else {
                // Si no coincide, escondemos a su padre para que se muestren en orden
                $(this).parent().hide(); // Esconder el resultado si no coincide
            }
        });
    }

    // Añadimos el evento de filtrado a los campos de búsqueda
    $('#email, #horaInicio, #horaFin').on('input', filterResults);
    $('#facultad, #instalacion, #fecha').on('change', filterResults);
});

$('#buscarBtn').on('click', function() {
    let filtros = {};
    $('.form-control').each(function(index, element) {
        const valor = $(element).val(); // Obtiene el valor del campo

        // Verifica si el campo tiene algún valor
        if (valor !== '') {
            let etiqueta = $(element).attr('id');
            filtros[etiqueta] = valor; // Agrega al objeto JSON
        }
    }); 
    $('.form-select').each(function(index, element) {
        const valorSeleccionado = $(element).val();
        if (valorSeleccionado !== null && valorSeleccionado !== '') {
            let etiqueta = $(element).attr('id');
            const valorOptionSeleccionado = $(element).find('option:selected').val();
            filtros[etiqueta] = valorOptionSeleccionado; // Agrega al objeto JSON
        }
    }); 

    // Enviar la petición AJAX
    $.ajax({
        url: '/reserva/busqueda',
        type: 'GET',
        data: filtros,
        success: function(response) {
            // Manejar la respuesta del servidor aquí
            console.log('Respuesta del servidor:', response);
        },
        error: function(error) {
            // Manejar errores aquí
            console.error('Error en la solicitud AJAX:', error);
        }
    });

});
