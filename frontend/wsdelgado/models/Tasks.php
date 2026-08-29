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
    public $actual_end;
    public $proof_image;
    public $notes;
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
                    start_date=:start_date, end_date=:end_date, actual_end=:actual_end, quantity=:quantity, finished=:finished";

        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":severity", $this->severity);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":actual_end", $this->actual_end);
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
        $query = "SELECT t.*, p.name as project_name, GROUP_CONCAT(e.name SEPARATOR ', ') as assigned_employees
                FROM " . $this->table_name . " t
                LEFT JOIN projects p ON t.project_id = p.id
                LEFT JOIN task_history th ON th.task_id = t.id 
                    AND th.created_at = (SELECT MAX(created_at) FROM task_history WHERE task_id = t.id)
                LEFT JOIN employees e ON th.employee_id = e.id
                GROUP BY t.id
                ORDER BY t.end_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ ONE
    public function readOne()
    {
        $query = "SELECT t.*, p.name as project_name, GROUP_CONCAT(e.name SEPARATOR ', ') as assigned_employees
                FROM " . $this->table_name . " t
                LEFT JOIN projects p ON t.project_id = p.id
                LEFT JOIN task_history th ON th.task_id = t.id 
                    AND th.created_at = (SELECT MAX(created_at) FROM task_history WHERE task_id = t.id)
                LEFT JOIN employees e ON th.employee_id = e.id
                WHERE t.id = :id
                GROUP BY t.id";
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
                    start_date=:start_date, end_date=:end_date, actual_end=:actual_end, proof_image=:proof_image, notes=:notes, quantity=:quantity, finished=:finished
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":severity", $this->severity);
        $stmt->bindParam(":project_id", $this->project_id);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":actual_end", $this->actual_end);
        $stmt->bindParam(":proof_image", $this->proof_image);
        $stmt->bindParam(":notes", $this->notes);
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
        $this->actual_end = htmlspecialchars(strip_tags($this->actual_end));
        $this->notes = htmlspecialchars(strip_tags($this->notes ?? ""));
        // proof_image is base64 data; sanitize() is not called on create for it
    }
}
?>