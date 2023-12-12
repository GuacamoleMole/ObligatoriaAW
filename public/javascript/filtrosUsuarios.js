$(document).ready(function () {
    // Función para filtrar dependiendo de nombre y apellidos
    function filterResults() {
        let nombreFilter = $('#nombre').val().toLowerCase();
        let apellidosFilter = $('#apellidos').val().toLowerCase();
        let facultadFilter = $('#facultad').val().toLowerCase();

        $('.resultadoBusqueda').each(function () {
            let nombre = $(this).find('.campoUsuarioNombre').text().toLowerCase();
            let apellidos = $(this).find('.campoUsuarioApellidos').text().toLowerCase();
            let facultad = $(this).find('.campoUsuarioFacultad').text().toLowerCase();

            // Comprobar si el item actual coincide con los criterios de filtrado
            if ((nombre.indexOf(nombreFilter) > -1 || nombreFilter === '') &&
                (apellidos.indexOf(apellidosFilter) > -1 || apellidosFilter === '') &&
                (facultad.indexOf(facultadFilter) > -1 || facultadFilter === '' || facultadFilter === 'todos')) {
                $(this).parent().show(); // Enseñar el resultado si coincide
            } else {
                // Si no coincide, escondemos a su padre para que se muestren en orden
                $(this).parent().hide(); // Esconder el resultado si no coincide
            }
        });
    }

    // Añadimos el evento de filtrado a los campos de búsqueda
    $('#nombre, #apellidos').on('input', filterResults);
    $('#facultad').on('change', filterResults);
});