$(document).ready(() => {
    const campoNombre = $('#nombre');
    const campoApellidos = $('#apellidos');
    const campoEmail = $('#email');
    const campoContrasena = $('#contrasena');

    const errorNombre = $('#errorNombre');
    const errorApellidos = $('#errorApellidos');
    const errorEmail = $('#errorEmail');
    const errorContrasena = $('#errorContrasena');

    const botonMostrarContrasena = $('#mostrarContrasena');

    campoNombre.on('change', () => {
        let valor = campoNombre.val();

        if (valor === "") {
            errorNombre.text('El campo nombre no puede estar vacío');
        } else if (/\d/.test(valor)) {
            errorNombre.text('El campo nombre no puede contener números');
        } else {
            errorNombre.text('');
        }
    })

    campoApellidos.on('change', () => {
        let valor = campoApellidos.val();

        if (valor === "") {
            errorApellidos.text('El campo apellidos no puede estar vacío');
        } else if (/\d/.test(valor)) {
            errorApellidos.text('El campo apellidos no puede contener números');
        } else {
            errorApellidos.text('');
        }
    })

    campoEmail.on('change', () => {
        let valor = campoEmail.val();

        if (valor === "") {
            errorEmail.text('El campo email no puede estar vacío');
        } // else if check that email is valid (using regex having characters, an @ symbol, and a domain)
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
            errorEmail.text('El campo email no es válido');
        } else if (!/^[a-zA-Z0-9]+@ucm.es$/.test(valor)) {
            errorEmail.text('El email debe ser de la UCM');
        } else {
            errorEmail.text('');
        }
    })

    campoContrasena.on('change', () => {
        let valor = campoContrasena.val();

        if (valor === "") {
            errorContrasena.text('El campo contraseña no puede estar vacío');
        } else {
            errorNombre.text('');
        }
    })

    botonMostrarContrasena.on('click', () => {
        if (campoContrasena.attr('type') === 'password') {
            campoContrasena.attr('type', 'text');
        } else {
            campoContrasena.attr('type', 'password');
        }
    })
});