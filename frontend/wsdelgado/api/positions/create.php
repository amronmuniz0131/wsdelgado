<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Position.php';

$database = new Database();
$db = $database->getConnection();

$position = new Position($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->position)){
    $position->position = $data->position;

    if($position->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Position was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create position."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create position. Data is incomplete."));
}
?>
