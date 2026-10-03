<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Gallery.php';

$database = new Database();
$db = $database->getConnection();

$gallery = new Gallery($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->title) && !empty($data->images) && count($data->images) > 0) {
    $gallery->title = $data->title;
    $gallery->caption = isset($data->caption) ? $data->caption : "";
    $gallery->cover_image = $data->images[0]->image; // first image is the cover

    if($gallery->createAlbum($data->images)) {
        http_response_code(201);
        echo json_encode(array("message" => "Album was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create album."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create album. Title and at least one image are required."));
}
?>
