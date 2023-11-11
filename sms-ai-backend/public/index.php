<?php
include_once "../src/DB.php";
include_once "../src/Routes.php";
include_once "../src/Helper.php";

Helper::loadEnv("../.env");
$db = new DB();

if (!isset(getallheaders()["Apikey"]) || !in_array(getallheaders()["Apikey"], $db->getApiKeys())) {
	die("Auth error");
}

$routes = new Routes($db);
$routes->resolve(explode("?", $_SERVER['REQUEST_URI'])[0] . $_SERVER["REQUEST_METHOD"]);
