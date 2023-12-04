$(document).ready(function () {
    console.log("Hoola");
    $("#logout").click(function (event) {
        event.preventDefault();

        $.ajax({
            url: "/logout", // Reemplaza con la URL correcta para la acción de logout en tu servidor
            type: "DELETE",
            success: function (data) {
                console.log("Logout exitoso");
                window.location.href = "/";
            },
            error: function (error) {
                console.error("Error en el logout", error);
            }
        });
    });
});