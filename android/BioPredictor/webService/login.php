<?php
include("DataBaseClass.php");
$dataBase = new DataBase("mysql.hostinger.es", "u152986297_root", "qwerty123", "u152986297_bio");

$Name = $_POST["Name"];
$Email = $_POST["Email"];

echo $dataBase->doQuery("call loginUser('$Name', '$Email');");
$dataBase->close();
?>