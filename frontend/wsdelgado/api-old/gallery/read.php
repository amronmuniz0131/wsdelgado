<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Gallery.php';

$database = new Database();
$db = $database->getConnection();

$gallery = new Gallery($db);
$stmt = $gallery->read();
$num = $stmt->rowCount();

if($num > 0) {
    $albums = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $album_key = "album_" . $album_id;

        if(!isset($albums[$album_key])) {
            $albums[$album_key] = array(
                "id" => $album_id,
                "title" => html_entity_decode($album_title),
                "caption" => html_entity_decode($album_caption),
                "cover_image" => $cover_image,
                "created_at" => $album_created_at,
                "images" => array()
            );
        }

        if($image_id !== null) {
            array_push($albums[$album_key]["images"], array(
                "id" => $image_id,
                "title" => html_entity_decode($image_title),
                "caption" => html_entity_decode($image_caption),
                "image" => $image
            ));
        }
    }

    http_response_code(200);
    echo json_encode(array("records" => array_values($albums)));
} else {
    http_response_code(200);
    echo json_encode(array("records" => array(), "message" => "No albums found."));
}
?>
