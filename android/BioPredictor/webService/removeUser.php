<?php
include("DataBaseClass.php");
$dataBase = new DataBase("mysql.hostinger.es", "u152986297_root", "qwerty123", "u152986297_bio");

$IdUser = $_POST["IdUser"];

echo $dataBase->doQuery("call removeUser($IdUser);");
$dataBase->close();
?>