<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Position.php';

$database = new Database();
$db = $database->getConnection();

$position = new Position($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $position->id = $data->id;

    if($position->delete()){
        http_response_code(200);
        echo json_encode(array("message" => "Position was deleted."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete position."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete position. Data is incomplete."));
}
?>
