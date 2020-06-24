<?php
    $accion = $_GET['accion'];
    $id = $_GET['id'];

    if ($accion === 'borrar') {
        //importar la conexion
        include '../funciones/conexion.php';
        
        try {
            //Realizar la consulta
            $stmt1 = $conn->prepare("DELETE FROM tareas WHERE id_proyecto = ?");
            $stmt = $conn->prepare("DELETE FROM proyectos WHERE id = ?");
            $stmt1->bind_param('i', $id);
            $stmt->bind_param('i', $id);
            $stmt1->execute();
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $respuesta = array (
                    'respuesta' => 'correcto',
                );
            } else {
                $respuesta = array (
                    'respuesta' => 'error',
                    'stmt' => $stmt1->affected_rows
                );
            }
            $stmt1->close();
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