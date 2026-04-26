<?php
class Task
{
    private $conn;
    private $table_name = "tasks";

    public $id;
    public $name;
    public $status;
    public $severity;
    public $project_id;
    public $start_date;
    public $end_date;
    public $quantity;
    public $finished;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                SET name=:name, status=:status, severity=:severity, project_id=:project_id, 
                    start_date=:start_date, end_date=:end_date, quantity=:quantity, finished=:finished";

        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":severity", $this->severity);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":finished", $this->finished);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ ALL
    public function read()
    {
        $query = "SELECT t.*, p.name as project_name
                FROM " . $this->table_name . " t
                LEFT JOIN projects p ON t.project_id = p.id
                ORDER BY t.end_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ ONE
    public function readOne()
    {
        $query = "SELECT t.*, p.name as project_name
                FROM " . $this->table_name . " t
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE t.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            foreach ($row as $key => $value) {
                $this->$key = $value;
            }
            return true;
        }
        return false;
    }

    // UPDATE
    public function update()
    {
        $query = "UPDATE " . $this->table_name . " 
                SET name=:name, status=:status, severity=:severity, project_id=:project_id, 
                    start_date=:start_date, end_date=:end_date, quantity=:quantity, finished=:finished
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":severity", $this->severity);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":finished", $this->finished);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    private function sanitize()
    {
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->severity = htmlspecialchars(strip_tags($this->severity));
        $this->project_id = htmlspecialchars(strip_tags($this->project_id));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->finished = htmlspecialchars(strip_tags($this->finished));
    }
}
?>