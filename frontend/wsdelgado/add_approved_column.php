<?php
$host = "localhost";
$username = "root";
$password = "";
$db_name = "api_db";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql_add_approved = "ALTER TABLE equipments ADD COLUMN is_approved TINYINT(1) DEFAULT 0";
    $pdo->exec($sql_add_approved);
    echo "Added is_approved column to equipments table.\n";

} catch (PDOException $e) {
    if ($e->getCode() == '42S21') {
        echo "Column is_approved already exists.\n";
    } else {
        die("DB ERROR: " . $e->getMessage());
    }
}
?>
