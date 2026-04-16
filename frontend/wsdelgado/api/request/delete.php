<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Requests.php';

$database = new Database();
$db = $database->getConnection();

$request = new Requests($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $request->id = $data->id;

    if($request->delete()){
        http_response_code(200);
        echo json_encode(array("message" => "Request was deleted."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete request."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete request. Data is incomplete."));
}
?>
