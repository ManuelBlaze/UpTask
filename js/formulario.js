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
            text: 'Ambos campos son obligatorios',
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
                console.log(JSON.parse(xhr.responseText));
            }
        };

        xhr.send(datos);

        swal({
            type: 'success',
            title: 'Correcto',
            text: 'Ambos campos son obligatorios',
        });
    }
}