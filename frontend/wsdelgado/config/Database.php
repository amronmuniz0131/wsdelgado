<?php
class Database
{
    private $host = "deeppink-cormorant-307805.hostingersite.com";
    private $db_name = "u312009988_api_db"; // You might need to change this or create this DB
    private $username = "u312009988_wsdelgado";
    private $password = "Admin123!";
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