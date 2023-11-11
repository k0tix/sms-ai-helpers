<?php

declare(strict_types=1);

class DB
{
    private $db;
    public function __construct()
    {
        $this->db = self::getDBStatic();
    }
    public function getDB(): PDO
    {
        return $this->db;
    }
    public static function getDBStatic(): PDO
    {
        return new PDO("pgsql:host=". $_ENV["DBHOST"] . ";port=" . $_ENV["DBPORT"] . ";dbname=dbname;", 'dbuser', 'dbpass');
    }
    public function getApiKeys(): array
    {
        $keys = $this->getDB()->query("select api_key from api_keys")->fetchAll(PDO::FETCH_ASSOC);
        return array_column($keys, "api_key");
    }
}
