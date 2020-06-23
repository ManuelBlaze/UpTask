<?php 

    include_once 'includes/funciones/sesiones.php';
    include_once 'includes/funciones/funciones.php';
    include_once 'includes/templates/header.php';
    include_once 'includes/templates/barra.php';
    
    //Obtener id de la url
    if (isset($_GET['id_proyecto'])) {
        $id_proyecto = $_GET['id_proyecto'];
    } else {
        $id_proyecto = null;
    }
?>

<div class="contenedor">

    <?php include_once 'includes/templates/sidebar.php'; ?>

    <main class="contenido-principal">
        
        <?php
            $proyecto = obtenerNombreProyecto($id_proyecto);
            if ($proyecto) { ?>
                <h1>
                    <?php foreach ($proyecto as $nombre ): ?>
                        <span><?php echo $nombre['nombre']; ?></span>          
                    <?php endforeach; ?>
                </h1>

                <form action="#" class="agregar-tarea">
                    <div class="campo">
                        <label for="tarea">Tarea:</label>
                        <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                    </div>
                    <div class="campo enviar">
                        <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto ?>">
                        <input type="submit" class="boton nueva-tarea" value="Agregar">
                    </div>
                </form>

                <h2>Listado de tareas:</h2>
                <div class="listado-pendientes">
                    <ul>
                        <?php
                            //obtener las tareas del proyecto actual
                            $tareas = obtenerTareasProyecto($id_proyecto);
                            if ($tareas->num_rows > 0) {
                                //si hay tareas
                                foreach ($tareas as $tarea ) { ?>
                                    <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                                        <p><?php echo $tarea['nombre'] ?></p>
                                            <div class="acciones">
                                                <i class="far fa-check-circle <?php echo ($tarea["estado"] === '1' ? 'completo' : '') ?>"></i>
                                                <i class="fas fa-trash"></i>
                                            </div>
                                    </li>  
                                <?php }
                            } else {
                                //no hay
                                echo "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                            }              
                        ?>
                    </ul>
                </div>
                <div class="avance">
                    <h2>Avance del Proyecto:</h2>
                    <div id="barra-avance" class="barra-avance">
                        <div id="porcentaje" class="porcentaje">
                        </div>                        
                    </div>
                </div>
        <?php } else {
                //Si no hay proyectos seleccionados
                echo "<p class='selecciona'> Selecciona un proyecto a la izquierda </p>";
                ?> <form action="#" class="agregar-tarea">
            <div class="campo">
                <label for="tarea">Tarea:</label>
                <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
            </div>
            <div class="campo enviar">
                <input type="hidden" id="id_proyecto" value="id_proyecto">
                <input type="submit" class="boton nueva-tarea " value="Agregar" disabled>
            </div>
        </form>
        
 

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>

                <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                <p>Selecciona o crea un Proyecto para agregar Tareas</p>
                    <div class="acciones">
                        
                    </div>
                </li>  
            </ul>
        </div> <?php
            } ?>
    </main>
</div><!--.contenedor-->

<?php include_once 'includes/templates/footer.php' ?>