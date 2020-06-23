eventListeners();

//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
}

function nuevoProyecto(e) {
    e.preventDefault();

    //Crear input para el nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //Seleccionar el ID
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //Presionar enter y crear proyecto

    inputNuevoProyecto.addEventListener('keypress', function (e) {
        var tecla = e.wich || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    //crer llamado a AJAX
    var xhr = new XMLHttpRequest();

    //Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //Abrir conexion
    xhr.open('POST', 'includes/modelos/modelo-proyectos.php', true);

    //En la carga
    xhr.onload = function () {
        if (this.status === 200) {
            //Guardar respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //Comprobar la inserción
            if (resultado === 'correcto') {
                if (tipo === 'crear') {
                    //Inyectar el html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_repuesta=${id_proyecto}" id="${id_proyecto}">
                            ${nombreProyecto}
                        </a>
                    `;
                    listaProyectos.appendChild(nuevoProyecto);
                    //Mostrar alerta
                    swal({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamente'
                    }).then(resultado => {
                        //Redireccionar
                        if (resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    });
                } else {

                }
            } else {
                swal({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error'
                });
            }
        }
    }

    //Enviar el request
    xhr.send(datos);
}