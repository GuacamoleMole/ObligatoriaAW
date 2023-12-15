$(document).ready(function () {
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
                // Limpiar el contenido actual de resultados
                 $('#resultadosBusqueda').empty();
    
                // Agregar el nuevo contenido
                $('#resultadosBusqueda').append(response);
            },
            error: function(error) {
                // Manejar errores aquí
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    
    });
});
