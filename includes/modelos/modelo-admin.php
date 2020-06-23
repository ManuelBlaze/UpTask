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

        $respuesta = array (
            'pass' => $hash_password
        );
        echo json_encode($respuesta);
    }

?>