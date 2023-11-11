<?php
include "../src/DB.php";
include "../src/Routes.php";
$db = new DB();

if(!isset(getallheaders()["Apikey"]) || !in_array(getallheaders()["Apikey"], $db->getApiKeys())){
	die("Auth error");
}

$routes = new Routes($db);
$routes->resolve(explode("?",$_SERVER['REQUEST_URI'])[0].$_SERVER["REQUEST_METHOD"]);
