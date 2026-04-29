<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Equipment.php';

$database = new Database();
$db = $database->getConnection();

$equipment = new Equipment($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name)){
    $equipment->name = $data->name;
    $equipment->type = $data->type ?? "";
    $equipment->status = $data->status ?? "Available";
    $equipment->project_id = $data->project_id ?? null;
    $equipment->operator_id = $data->operator_id ?? null;
    $equipment->requested_by_id = $data->requested_by_id ?? null;
    $equipment->estimated_hours = $data->estimated_hours ?? 0;
    $equipment->borrow_date = $data->borrow_date ?? null;
    $equipment->return_date = $data->return_date ?? null;
    $equipment->is_approved = $data->is_approved ?? 0;

    if($equipment->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Equipment was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create equipment."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create equipment. Data is incomplete."));
}
?>
