<?php
    $accion = $_GET['accion'];
    $id = $_GET['id'];

    if ($accion === 'borrar') {
        //importar la conexion
        include '../funciones/conexion.php';
        
        try {
            //Realizar la consulta
            $stmt = $conn->prepare("DELETE FROM proyectos WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array (
                    'respuesta' => 'correcto',
                );
            } else {
                $respuesta = array (
                    'respuesta' => 'error'
                );
            }

            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //tomar la exception
            $respuesta = array (
                'error' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    };
?>