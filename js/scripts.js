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
    //Inyectar el html
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = `
        <a href="#">
            ${nombreProyecto}
        </a>
    `;
    listaProyectos.appendChild(nuevoProyecto);
}