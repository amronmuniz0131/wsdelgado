<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Requests.php';

$database = new Database();
$db = $database->getConnection();

$request = new Requests($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->material_id)){
    $request->material_id = $data->material_id;
    $request->quantity = $data->quantity;
    $request->engineer_id = $data->engineer_id;
    $request->project_id = $data->project_id;
    $request->request_date = $data->request_date;
    $request->is_approve = $data->is_approve;

    if($request->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Request was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create request."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create request. Data is incomplete."));
}
?>
