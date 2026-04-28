<?php
class TaskHistory {
    private $conn;
    private $table_name = "task_history";

    public $id;
    public $task_id;
    public $employee_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET task_id=:task_id, employee_id=:employee_id";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":task_id", $this->task_id);
        $stmt->bindParam(":employee_id", $this->employee_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ
    public function read() {
        $query = "SELECT th.*, e.name as employee_name, t.name as task_name, p.name as project_name, p.id as project_id 
                FROM " . $this->table_name . " th
                LEFT JOIN employees e ON th.employee_id = e.id
                LEFT JOIN tasks t ON th.task_id = t.id
                AND th.created_at = (SELECT MAX(created_at) FROM task_history WHERE task_id = t.id)
                LEFT JOIN projects p ON t.project_id = p.id
                ORDER BY th.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ BY TASK
    public function readByTask() {
        $query = "SELECT th.*, e.name as employee_name, t.name as task_name, p.name as project_name, p.id as project_id
                FROM " . $this->table_name . " th
                LEFT JOIN employees e ON th.employee_id = e.id
                LEFT JOIN tasks t ON th.task_id = t.id
                AND th.created_at = (SELECT MAX(created_at) FROM task_history WHERE task_id = t.id)
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE th.task_id = ?
                ORDER BY th.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->task_id);
        $stmt->execute();
        return $stmt;
    }

    // DELETE (Unassign)
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE task_id = :task_id AND employee_id = :employee_id";
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":task_id", $this->task_id);
        $stmt->bindParam(":employee_id", $this->employee_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    private function sanitize() {
        $this->task_id = htmlspecialchars(strip_tags($this->task_id));
        $this->employee_id = htmlspecialchars(strip_tags($this->employee_id));
    }
}
?>
