eventListeners();

//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //nueva Tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //Acciones d elas tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
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
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
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

//gregar nueva tarea

function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    if (nombreTarea === '') {
        swal({
            type: 'error',
            title: 'Error',
            text: 'No puedes enviar una tarea vacía'
        });
    } else {
        //crer llamado a AJAX
        var xhr = new XMLHttpRequest();

        //Enviar datos por formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);


        //Abrir conexion
        xhr.open('POST', 'includes/modelos/modelo-tareas.php', true);

        //En la carga
        xhr.onload = function () {
            if (this.status === 200) {
                //Guardar respuesta
                var respuesta = JSON.parse(xhr.responseText);

                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    if (tipo === 'crear') {
                        //Lanzar alerta
                        swal({
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'La tarea: ' + tarea + ' se creó correctamente'
                        });

                        //construit template
                        var nuevaTarea = document.createElement('li');

                        //Agregar ID
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        //Agregar clase tarea
                        nuevaTarea.classList.add('tarea');

                        //Insertar en el html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class = "acciones">
                                <i class = "far fa-check-circle"> </i> 
                                <i class = "fas fa-trash"> </i> 
                            </div>
                        `;

                        //Agregar a la lista
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();
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
}

//Acciones para las tareas, cambia estaod o elimina

function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')) {
        //Listo
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }

    }
    if (e.target.classList.contains('fa-trash')) {
        //Borrar
        Swal.fire({
            title: 'Seguro(a)?',
            text: "Esta acción no se puede deshacer!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                //Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                //Borrar del html
                tareaEliminar.remove();

                Swal.fire(
                    'Eliminado!',
                    'La tarea fue eliminada.',
                    'success'
                )
            }
        });
    }
}

//Completar o descompletar tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');

    //Llamado a AJAX
    var xhr = new XMLHttpRequest();

    //info
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    //Abrir conexion
    xhr.open('POST', 'includes/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function () {
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));
        }
    }

    //enviar peticion
    xhr.send(datos);
}


//Eliminar Tarea de la BD

function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');

    //Llamado a AJAX
    var xhr = new XMLHttpRequest();

    //info
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    //Abrir conexion
    xhr.open('POST', 'includes/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function () {
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));
        }
    }

    //enviar peticion
    xhr.send(datos);
}