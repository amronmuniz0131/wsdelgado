<?php
$host = "localhost";
$username = "root";
$password = "";

try {
    // Connect to MySQL server (no DB selected)
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to MySQL server.\n";

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS api_db");
    echo "Database 'api_db' created or already exists.\n";

    // Use database
    $pdo->exec("USE api_db");

    // Create table (read from file or hardcoded)
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        email VARCHAR(50),
        password VARCHAR(256),
        role VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "Table 'users' created or already exists.\n";
    
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
?>
