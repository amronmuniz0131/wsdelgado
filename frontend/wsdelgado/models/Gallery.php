<?php
class Gallery {
    private $conn;
    private $albums_table = "gallery_albums";
    private $images_table = "gallery_images";

    public $id;
    public $album_id;
    public $title;
    public $caption;
    public $image;
    public $cover_image;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create an album with multiple images in one call
    public function createAlbum($images) {
        $query = "INSERT INTO " . $this->albums_table . "
                SET
                    title = :title,
                    caption = :caption,
                    cover_image = :cover_image";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->caption = htmlspecialchars(strip_tags($this->caption));

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':caption', $this->caption);
        $stmt->bindParam(':cover_image', $this->cover_image); // base64, stored as-is

        if(!$stmt->execute()) {
            return false;
        }

        $album_id = $this->conn->lastInsertId();

        $img_query = "INSERT INTO " . $this->images_table . "
                SET
                    album_id = :album_id,
                    title = :title,
                    caption = :caption,
                    image = :image";

        $img_stmt = $this->conn->prepare($img_query);

        foreach ($images as $img) {
            $img_title = htmlspecialchars(strip_tags($img->title));
            $img_caption = htmlspecialchars(strip_tags($img->caption));
            $img_stmt->bindParam(':album_id', $album_id);
            $img_stmt->bindParam(':title', $img_title);
            $img_stmt->bindParam(':caption', $img_caption);
            $img_stmt->bindParam(':image', $img->image); // base64, stored as-is
            if(!$img_stmt->execute()) {
                return false;
            }
        }

        return true;
    }

    // Add images to an existing album
    public function addImages($images) {
        $query = "INSERT INTO " . $this->images_table . "
                SET
                    album_id = :album_id,
                    title = :title,
                    caption = :caption,
                    image = :image";

        $stmt = $this->conn->prepare($query);

        $this->album_id = htmlspecialchars(strip_tags($this->album_id));

        foreach ($images as $img) {
            $img_title = htmlspecialchars(strip_tags($img->title));
            $img_caption = htmlspecialchars(strip_tags($img->caption));
            $stmt->bindParam(':album_id', $this->album_id);
            $stmt->bindParam(':title', $img_title);
            $stmt->bindParam(':caption', $img_caption);
            $stmt->bindParam(':image', $img->image);
            if(!$stmt->execute()) {
                return false;
            }
        }

        return true;
    }

    // Read all albums with their images (grouped)
    public function read() {
        $query = "SELECT a.id AS album_id, a.title AS album_title, a.caption AS album_caption, a.cover_image, a.created_at AS album_created_at,
                    i.id AS image_id, i.title AS image_title, i.caption AS image_caption, i.image
                FROM " . $this->albums_table . " a
                LEFT JOIN " . $this->images_table . " i ON i.album_id = a.id
                ORDER BY a.created_at DESC, i.created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Delete an album (images cascade)
    public function deleteAlbum() {
        $query = "DELETE FROM " . $this->albums_table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete a single image
    public function deleteImage() {
        $query = "DELETE FROM " . $this->images_table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
