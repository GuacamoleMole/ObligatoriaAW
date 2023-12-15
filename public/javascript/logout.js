$(document).ready(function () {
    $("#logout").click(function (event) {
        event.preventDefault();

        $.ajax({
            url: "/usuario/logout", 
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