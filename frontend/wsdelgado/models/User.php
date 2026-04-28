<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $password;
    public $role;
    public $created_at;
    public $first_login;

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ
    public function read() {
        $query = "SELECT id, name, email, password, role, created_at FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, email=:email, password=:password, role=:role, first_login=0";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        $this->role = htmlspecialchars(strip_tags($this->role));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":role", $this->role);
        try {
            if($stmt->execute()) {
                // Automatically create an employee profile for engineers and admins
                if ($this->role === 'engineer' || $this->role === 'admin') {
                    include_once 'Employee.php';
                    $employee = new Employee($this->conn);
                    $employee->name = $this->name;
                    $employee->email = $this->email;
                    $employee->position = $this->role;
                    $employee->employee_id = "EMP-" . strtoupper(substr(uniqid(), -5));
                    $employee->date_of_employment = date('Y-m-d');
                    $employee->create();
                }
                return true;
            }
        } catch (PDOException $e) {
            // Check for duplicate entry in exception (SQLState 23000 or MySQL code 1062)
            if ($e->getCode() == '23000' || strpos($e->getMessage(), '1062') !== false) {
                http_response_code(401);
                echo json_encode(array("message" => "Email already exists.", "error" => 401));
                exit;
            }
            throw $e;
        }

        // Check for duplicate entry via errorInfo (if silent mode)
        $errorInfo = $stmt->errorInfo();
        if ($stmt->errorCode() == '23000' || (isset($errorInfo[1]) && $errorInfo[1] == 1062)) {
            http_response_code(401);
            echo json_encode(array("message" => "Email already exists."));
            exit;
        }

        return false;
    }

    // READ SINGLE
    public function readOne() {
        $query = "SELECT id, name, email, password, role, created_at, first_login FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->created_at = $row['created_at'];
            $this->first_login = $row['first_login'];
            return true;
        }
        return false;
    }

    // UPDATE
    public function update() {
        $password_set = !empty($this->password);
        $query = "UPDATE " . $this->table_name . " 
                  SET name = :name, 
                      email = :email, 
                      role = :role,
                      first_login = :first_login" . 
                  ($password_set ? ", password = :password" : "") . " 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->first_login = htmlspecialchars(strip_tags($this->first_login));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':first_login', $this->first_login);

        if($password_set) {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(':password', $this->password);
        }

        try {
            if($stmt->execute()) {
                return true;
            }
        } catch (PDOException $e) {
            // Check for duplicate entry in exception (SQLState 23000 or MySQL code 1062)
            if ($e->getCode() == '23000' || strpos($e->getMessage(), '1062') !== false) {
                http_response_code(401);
                echo json_encode(array("message" => "Email already exists."));
                exit;
            }
            throw $e;
        }

        // Check for duplicate entry via errorInfo (if silent mode)
        $errorInfo = $stmt->errorInfo();
        if ($stmt->errorCode() == '23000' || (isset($errorInfo[1]) && $errorInfo[1] == 1062)) {
            http_response_code(401);
            echo json_encode(array("message" => "Email already exists."));
            exit;
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

    // LOGIN
    public function login($email, $password) {
        $query = "SELECT id, name, email, password, role, first_login FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row && password_verify($password, $row['password'])) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->role = $row['role'];
            $this->first_login = $row['first_login'];
            return true;
        }
        return false;
    }

    public function update_first_login() {
        $query = "UPDATE " . $this->table_name . " SET first_login = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->first_login = htmlspecialchars(strip_tags($this->first_login));
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->first_login);
        $stmt->bindParam(2, $this->id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
