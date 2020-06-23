<?php

    $accion = $_POST['accion'];
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    
    if ($accion === 'crear') {
        //Hashear passwords
        $opciones = array(
            'cost' => 10
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        
        //importar la conexion
        include '../funciones/conexion.php';
        
        try {
            //Realizar la consulta
            $stmt = $conn->prepare('INSERT INTO usuarios (usuario, password) VALUES (?, ?)') ;
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                $respuesta = array (
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
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
            'pass' => $e->getMessage()
            );
        }


        echo json_encode($respuesta);
    }

?>