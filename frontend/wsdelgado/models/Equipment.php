<?php
class Equipment {
    private $conn;
    private $table_name = "equipments";

    public $id;
    public $name;
    public $type;
    public $status;
    public $project_id;
    public $operator_id;
    public $requested_by_id;
    public $estimated_hours;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET name=:name, type=:type, status=:status, 
                    project_id=:project_id, operator_id=:operator_id, 
                    requested_by_id=:requested_by_id, estimated_hours=:estimated_hours";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":operator_id", $this->operator_id);
        $stmt->bindParam(":requested_by_id", $this->requested_by_id);
        $stmt->bindParam(":estimated_hours", $this->estimated_hours);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ ALL
    public function read() {
        $query = "SELECT q.*, p.name as project_name, o.name as operator_name, r.name as requested_by_name 
                FROM " . $this->table_name . " q
                LEFT JOIN projects p ON q.project_id = p.id
                LEFT JOIN employees o ON q.operator_id = o.id
                LEFT JOIN employees r ON q.requested_by_id = r.id
                ORDER BY q.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ ONE
    public function readOne() {
        $query = "SELECT q.*, p.name as project_name, o.name as operator_name, r.name as requested_by_name 
                FROM " . $this->table_name . " q
                LEFT JOIN projects p ON q.project_id = p.id
                LEFT JOIN employees o ON q.operator_id = o.id
                LEFT JOIN employees r ON q.requested_by_id = r.id
                WHERE q.id = ? LIMIT 0,1";
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
                SET name=:name, type=:type, status=:status, 
                    project_id=:project_id, operator_id=:operator_id, 
                    requested_by_id=:requested_by_id, estimated_hours=:estimated_hours 
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":operator_id", $this->operator_id);
        $stmt->bindParam(":requested_by_id", $this->requested_by_id);
        $stmt->bindParam(":estimated_hours", $this->estimated_hours);
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
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->project_id = $this->project_id ? htmlspecialchars(strip_tags($this->project_id)) : null;
        $this->operator_id = $this->operator_id ? htmlspecialchars(strip_tags($this->operator_id)) : null;
        $this->requested_by_id = $this->requested_by_id ? htmlspecialchars(strip_tags($this->requested_by_id)) : null;
        $this->estimated_hours = htmlspecialchars(strip_tags($this->estimated_hours));
    }
}
?>
