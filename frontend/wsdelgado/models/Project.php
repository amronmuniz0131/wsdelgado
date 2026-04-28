<?php
class Project {
    private $conn;
    private $table_name = "projects";

    public $id;
    public $name;
    public $location;
    public $client;
    public $address;
    public $progress;
    public $foreman_id;
    public $engineer_id;
    public $created_at;
    public $updated_at;
    public $start_date;
    public $end_date;
    public $completion_date;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET name=:name, location=:location, client=:client, 
                    address=:address, progress=:progress, 
                    foreman_id=:foreman_id, engineer_id=:engineer_id,
                    start_date=:start_date, end_date=:end_date";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":client", $this->client);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":progress", $this->progress);
        $stmt->bindParam(":foreman_id", $this->foreman_id);
        $stmt->bindParam(":engineer_id", $this->engineer_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // READ ALL
    public function read() {
        $query = "SELECT p.*, f.name as foreman_name, u.name as engineer_name, c.name as client_name 
                FROM " . $this->table_name . " p
                LEFT JOIN employees f ON p.foreman_id = f.id
                LEFT JOIN employees u ON p.engineer_id = u.id
                LEFT JOIN users c ON p.client = c.id
                ORDER BY p.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ ONE
    public function readOne() {
        $query = "SELECT p.*, f.name as foreman_name, u.name as engineer_name, c.name as client_name 
                FROM " . $this->table_name . " p
                LEFT JOIN employees f ON p.foreman_id = f.id
                LEFT JOIN employees u ON p.engineer_id = u.id
                LEFT JOIN users c ON p.client = c.id
                WHERE p.id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            foreach($row as $key => $value) {
                $this->$key = $value;
            }
            return true;
        }
        return false;
    }

    // UPDATE
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET name=:name, location=:location, client=:client, 
                    address=:address, progress=:progress, 
                    foreman_id=:foreman_id, engineer_id=:engineer_id,
                    start_date=:start_date, end_date=:end_date,
                    completion_date=:completion_date 
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":client", $this->client);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":progress", $this->progress);
        $stmt->bindParam(":foreman_id", $this->foreman_id);
        $stmt->bindParam(":engineer_id", $this->engineer_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":completion_date", $this->completion_date);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    private function sanitize() {
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->client = htmlspecialchars(strip_tags($this->client));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->progress = htmlspecialchars(strip_tags($this->progress));
        $this->foreman_id = $this->foreman_id ? htmlspecialchars(strip_tags($this->foreman_id)) : null;
        $this->engineer_id = $this->engineer_id ? htmlspecialchars(strip_tags($this->engineer_id)) : null;
        $this->start_date = $this->start_date ? htmlspecialchars(strip_tags($this->start_date)) : null;
        $this->end_date = $this->end_date ? htmlspecialchars(strip_tags($this->end_date)) : null;
        $this->completion_date = $this->completion_date ? htmlspecialchars(strip_tags($this->completion_date)) : null;
    }
}
?>
