<?php 
    //Pagian actual que se ejecuta
    function obtenerPaginaActual() {
        $archivo = basename($_SERVER['PHP_SELF']);
        $pagina = str_replace(".php", "", $archivo);
        return $pagina;
    };

/* Consultas */

    //Obtener todos los Proyectos
    function obtenerProyectos() {
        include 'conexion.php';
        try {
            return $conn->query('SELECT * FROM proyectos');
        } catch (Exception $e) {
            echo "Error! : " . $e->getMessage();
            return false;
        }
    }

?>