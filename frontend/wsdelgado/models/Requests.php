<?php
class Requests {
    private $conn;
    private $table_name = "requests";

    public $id;
    public $material_id;
    public $quantity;
    public $engineer_id;
    public $project_id;
    public $request_date;
    public $is_approve;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET material_id=:material_id, quantity=:quantity, engineer_id=:engineer_id, 
                    project_id=:project_id, request_date=:request_date, 
                    is_approve=:is_approve";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":material_id", $this->material_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":engineer_id", $this->engineer_id);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":request_date", $this->request_date);
        $stmt->bindParam(":is_approve", $this->is_approve);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ ALL
    public function read() {
        $query = "SELECT m.*, e.name as engineer_name, p.name as project_name 
                FROM " . $this->table_name . " m
                LEFT JOIN employees e ON m.engineer_id = e.id
                LEFT JOIN projects p ON m.project_id = p.id
                ORDER BY m.request_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ ONE
    public function readOne() {
        $query = "SELECT m.* 
                FROM " . $this->table_name . " m
                WHERE m.id = ? LIMIT 0,1";
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
                SET material_id=:material_id, quantity=:quantity, engineer_id=:engineer_id, 
                    project_id=:project_id, request_date=:request_date, 
                    is_approve=:is_approve
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":material_id", $this->material_id);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":engineer_id", $this->engineer_id);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":request_date", $this->request_date);
        $stmt->bindParam(":is_approve", $this->is_approve);
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
        $this->material_id = htmlspecialchars(strip_tags($this->material_id));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->engineer_id = htmlspecialchars(strip_tags($this->engineer_id));
        $this->project_id = htmlspecialchars(strip_tags($this->project_id));
        $this->request_date = htmlspecialchars(strip_tags($this->request_date));
        $this->is_approve = htmlspecialchars(strip_tags($this->is_approve));
    }
}
?>
