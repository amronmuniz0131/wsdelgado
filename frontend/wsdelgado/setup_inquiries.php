<?php
// Script to create the inquiries table
$host = "localhost";
$username = "root";
$password = "";
$db_name = "api_db";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(256) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "Table 'inquiries' created successfully.\n";
    
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
?>
