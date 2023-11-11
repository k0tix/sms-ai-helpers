#!/usr/bin/env php
<?php
include __DIR__ . "/../src/DB.php";

$db = new DB();

$db->getDB()->query("DROP TABLE IF EXISTS api_keys");
$db->getDB()->query("CREATE TABLE api_keys (id SERIAL PRIMARY KEY, api_key VARCHAR NOT NULL)");
$db->getDB()->prepare("INSERT INTO api_keys (api_key) values (?)")->execute(["oskariPoju23"]);

$db->getDB()->query("DROP TABLE IF EXISTS pending_data");
$db->getDB()->query("CREATE TABLE pending_data (id SERIAL PRIMARY KEY, status VARCHAR NOT NULL, phone VARCHAR NOT NULL, response VARCHAR)");