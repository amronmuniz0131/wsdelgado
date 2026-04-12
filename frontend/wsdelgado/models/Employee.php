<?php
class Employee {
    private $conn;
    private $table_name = "employees";

    public $id;
    public $employee_id;
    public $name;
    public $position;
    public $assigned_project_id;
    public $date_of_employment;
    public $status;
    public $email;
    public $phone;
    public $address;
    public $notes;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET employee_id=:employee_id, name=:name, position=:position, 
                    assigned_project_id=:assigned_project_id, date_of_employment=:date_of_employment, 
                    status=:status, email=:email, phone=:phone, address=:address, notes=:notes";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":employee_id", $this->employee_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":position", $this->position);
        $stmt->bindParam(":assigned_project_id", $this->assigned_project_id);
        $stmt->bindParam(":date_of_employment", $this->date_of_employment);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":notes", $this->notes);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ ALL
    public function read() {
        $query = "SELECT e.*, p.name as project_name 
                FROM " . $this->table_name . " e
                LEFT JOIN projects p ON e.assigned_project_id = p.id
                ORDER BY e.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ ONE
    public function readOne() {
        $query = "SELECT e.*, p.name as project_name 
                FROM " . $this->table_name . " e
                LEFT JOIN projects p ON e.assigned_project_id = p.id
                WHERE e.id = ? LIMIT 0,1";
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
                SET employee_id=:employee_id, name=:name, position=:position, 
                    assigned_project_id=:assigned_project_id, date_of_employment=:date_of_employment, 
                    status=:status, email=:email, phone=:phone, address=:address, notes=:notes 
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":employee_id", $this->employee_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":position", $this->position);
        $stmt->bindParam(":assigned_project_id", $this->assigned_project_id);
        $stmt->bindParam(":date_of_employment", $this->date_of_employment);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":notes", $this->notes);
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
        $this->employee_id = htmlspecialchars(strip_tags($this->employee_id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->position = htmlspecialchars(strip_tags($this->position));
        $this->assigned_project_id = $this->assigned_project_id ? htmlspecialchars(strip_tags($this->assigned_project_id)) : null;
        $this->date_of_employment = htmlspecialchars(strip_tags($this->date_of_employment));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->notes = htmlspecialchars(strip_tags($this->notes));
    }
}
?>
