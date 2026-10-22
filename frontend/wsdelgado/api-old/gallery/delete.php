<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Gallery.php';

$database = new Database();
$db = $database->getConnection();

$gallery = new Gallery($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $gallery->id = $data->id;

    if($gallery->deleteAlbum()) {
        http_response_code(200);
        echo json_encode(array("message" => "Album was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete album."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete. Album ID is required."));
}
?>
