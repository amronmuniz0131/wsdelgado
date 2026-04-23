<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Requests.php';

$database = new Database();
$db = $database->getConnection();

$request = new Requests($db);

$request->id = isset($_GET['id']) ? $_GET['id'] : die();

if ($request->readOne()) {
    $request_arr = array(
        "id" => $request->id,
        "material_id" => $request->material_id,
        "material_name" => $request->material_name,
        "quantity" => $request->quantity,
        "engineer_id" => $request->engineer_id,
        "engineer_name" => $request->engineer_name,
        "project_id" => $request->project_id,
        "project_name" => $request->project_name,
        "request_date" => $request->request_date,
        "is_approve" => $request->is_approve
    );
    http_response_code(200);
    echo json_encode($request_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Request does not exist."));
}
?>