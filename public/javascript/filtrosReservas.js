$(document).ready(function () {
    // Función para filtrar dependiendo de nombre y apellidos
    function filterResults() {
        let facultadFilter = $('#facultad').val().toLowerCase();
        let instalacionFilter = $('#instalacion').val().toLowerCase();
        let emailFilter = $('#email').val().toLowerCase();
        let horaInicioFilter = $('#horaInicio').val().toLowerCase();
        let horaFinFilter = $('#horaFin').val().toLowerCase();

        $('.resultadoBusqueda').each(function () {
            let facultad = $(this).find('.campoUsuarioFacultad').text().toLowerCase();
            let instalacion = $(this).find('.campoInstalacion').text().toLowerCase();
            let email = $(this).find('.campoUsuarioEmail').text().toLowerCase();

            // Comprobar si el item actual coincide con los criterios de filtrado
            if ((instalacion.indexOf(instalacionFilter) > -1 || instalacionFilter === '' || instalacionFilter === 'todas') &&
                (email.indexOf(emailFilter) > -1 || emailFilter === '') &&
                (facultad.indexOf(facultadFilter) > -1 || facultadFilter === '' || facultadFilter === 'todos')) {
                $(this).parent().show(); // Enseñar el resultado si coincide
            } else {
                // Si no coincide, escondemos a su padre para que se muestren en orden
                $(this).parent().hide(); // Esconder el resultado si no coincide
            }
        });
    }

    // Añadimos el evento de filtrado a los campos de búsqueda
    $('#email').on('input', filterResults);
    $('#facultad', '#instalacion').on('change', filterResults);
});