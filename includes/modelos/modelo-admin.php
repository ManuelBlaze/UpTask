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
            'error' => $e->getMessage()
            );
        }


        echo json_encode($respuesta);
    };

    if ($accion === 'login') {
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //Seleccionar el admin de la bd
            $stmt = $conn->prepare('SELECT * FROM usuarios WHERE usuario = ?');
            $stmt->bind_param('s', $usuario);
            $stmt->execute();
            
            //Loguear el usuario
            $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
            $stmt->fetch();

            if ($nombre_usuario) {
                //El usuario existe, verificar pass
                if (password_verify($password ,$pass_usuario)) {
                    //Iniciar la sesion
                    session_start();
                    $_SESSION['nombre'] = $usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    $respuesta = array (
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                    );
                } else {
                    //Login incorrecto, enviar error
                    $respuesta = array (
                        'resultado' => 'Password Incorrecto'
                    );
                }

            } else {
                $respuesta = array (
                    'error' => 'Usuario no existe'
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
    };
?>