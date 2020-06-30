eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        swal({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
        });
    } else {
        //AJAX

        //datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //Llamado a AJAX
        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'includes/modelos/modelo-admin.php', true);

        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);

                // console.log(respuesta);
                if (respuesta.respuesta === 'correcto') {
                    if (respuesta.tipo === 'crear') {
                        swal({
                            type: 'success',
                            title: 'Usuario Creado',
                            text: 'El usuario se creó correctamente'
                        }).then(resultado => {
                            //Redireccionar
                            if (resultado.value) {
                                window.location.href = 'login.php';
                            }
                        });
                    } else if (respuesta.tipo === 'login') {
                        swal({
                                type: 'success',
                                title: 'Login Correcto',
                                text: 'Presiona OK para iniciar el dashboard'
                            })
                            .then(resultado => {
                                if (resultado.value) {
                                    window.location.href = 'index.php';
                                }
                            })
                    }
                } else {
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });
                }
            }
        };

        xhr.send(datos);
    }
}