<?php
class Database
{
    private $host = "srv1858.hstgr.io";
    // private $db_name = "api_db"; // You might need to change this or create this DB
    private $db_name = "u312009988_api_db"; // You might need to change this or create this DB
    // private $username = "root";
    private $username = "u312009988_wsdelgado";
    // private $password = "";
    private $password = "WsDelgado2026!";
    public $conn;

    public function getConnection()
    {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>