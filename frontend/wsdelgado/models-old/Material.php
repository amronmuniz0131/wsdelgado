<?php
class Material {
    private $conn;
    private $table_name = "materials";

    public $id;
    public $name;
    public $quantity;
    public $unit;
    public $last_restocked;
    public $max_stock;
    public $price;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET name=:name, quantity=:quantity, unit=:unit, 
                    max_stock=:max_stock, last_restocked=:last_restocked, 
                    price=:price";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":unit", $this->unit);
        $stmt->bindParam(":max_stock", $this->max_stock);
        $stmt->bindParam(":last_restocked", $this->last_restocked);
        $stmt->bindParam(":price", $this->price);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ ALL
    public function read() {
        $query = "SELECT m.* FROM " . $this->table_name . " m ORDER BY m.name ASC";
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
                SET name=:name, quantity=:quantity, unit=:unit, 
                    max_stock=:max_stock, last_restocked=:last_restocked, 
                    price=:price
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->sanitize();
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":unit", $this->unit);
        $stmt->bindParam(":max_stock", $this->max_stock);
        $stmt->bindParam(":last_restocked", $this->last_restocked);
        $stmt->bindParam(":price", $this->price);
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
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->unit = htmlspecialchars(strip_tags($this->unit));
        $this->max_stock = htmlspecialchars(strip_tags($this->max_stock));
        $this->last_restocked = htmlspecialchars(strip_tags($this->last_restocked));
        $this->price = htmlspecialchars(strip_tags($this->price));
    }
}
?>
