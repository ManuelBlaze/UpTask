<?php

    $conn = new mysqli('us-cdbr-east-02.cleardb.com','b0829dbf1609ed', '36d846d2', 'heroku_9c32420ff1b6f10');

    if ($conn->connect_error) {
        echo $conn->connect_error;
    }

    $conn->set_charset('utf8');
?>