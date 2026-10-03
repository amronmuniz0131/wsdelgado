<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Gallery.php';

$database = new Database();
$db = $database->getConnection();

$gallery = new Gallery($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->album_id) && !empty($data->images) && count($data->images) > 0) {
    $gallery->album_id = $data->album_id;

    if($gallery->addImages($data->images)) {
        http_response_code(201);
        echo json_encode(array("message" => "Images were added to the album."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to add images to the album."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to add images. Album ID and at least one image are required."));
}
?>
