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
    $request->readOne(); // Fetch existing data first

    if (property_exists($data, 'material_id')) {
        $request->material_id = $data->material_id;
    }
    if (property_exists($data, 'quantity')) {
        $request->quantity = $data->quantity;
    }
    if (property_exists($data, 'engineer_id')) {
        $request->engineer_id = $data->engineer_id;
    }
    if (property_exists($data, 'project_id')) {
        $request->project_id = $data->project_id;
    }
    if (property_exists($data, 'request_date')) {
        $request->request_date = $data->request_date;
    }
    if (property_exists($data, 'is_approve')) {
        $request->is_approve = $data->is_approve;
    }

    if($request->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Request was updated."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update request."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update request. ID is missing."));
}
?>
