<?php
if(false) {
	ini_set('display_errors','Off');
	ini_set('error_reporting', E_ALL );
	
}
include_once "../src/DB.php";
include_once "../src/Routes.php";
include_once "../src/Helper.php";

Helper::loadEnv("../.env");
$db = new DB();
$publicRoutes = ["/summaryGET"];
$function = explode("?", $_SERVER['REQUEST_URI'])[0] . $_SERVER["REQUEST_METHOD"];
if (!isset(getallheaders()["Apikey"]) || !in_array(getallheaders()["Apikey"], $db->getApiKeys())) {
	if (!in_array($function, $publicRoutes)) {
		die("Auth error");
	}
}

$routes = new Routes($db);
$routes->resolve($function);
