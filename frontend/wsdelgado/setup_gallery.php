<?php
// Script to create the gallery albums + images tables
$host = "localhost";
$username = "root";
$password = "";
$db_name = "api_db";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE IF NOT EXISTS gallery_albums (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(256) NOT NULL,
        caption TEXT,
        cover_image LONGTEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Table 'gallery_albums' created successfully.\n";

    $sql = "CREATE TABLE IF NOT EXISTS gallery_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        album_id INT NOT NULL,
        title VARCHAR(256),
        caption TEXT,
        image LONGTEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE
    )";

    $pdo->exec($sql);
    echo "Table 'gallery_images' created successfully.\n";

    // Drop the old single-image gallery table if it exists (data cannot be auto-migrated from single to album)
    $pdo->exec("DROP TABLE IF EXISTS gallery");
    echo "Old table 'gallery' dropped (if it existed).\n";

} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
?>
