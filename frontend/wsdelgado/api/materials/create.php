<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Material.php';

$database = new Database();
$db = $database->getConnection();

$material = new Material($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name)){
    $material->name = $data->name;
    $material->quantity = $data->quantity ?? 0;
    $material->unit = $data->unit ?? "";
    $material->max_stock = $data->max_stock ?? 0;
    $material->last_restocked = $data->last_restocked ?? date('Y-m-d H:i:s');
    $material->requesting_engineer_id = $data->requesting_engineer_id ?? null;
    $material->project_id = $data->project_id ?? null;
    $material->price = $data->price ?? 0;
    $material->is_approved = $data->is_approved ?? 0;

    if($material->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Material was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create material."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create project. Data is incomplete."));
}
?>
