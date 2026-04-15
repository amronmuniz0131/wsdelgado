<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Material.php';

$database = new Database();
$db = $database->getConnection();

$material = new Material($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $material->id = $data->id;
    $material->name = $data->name ?? "";
    $material->quantity = $data->quantity ?? 0;
    $material->unit = $data->unit ?? "";
    $material->last_restocked = $data->last_restocked ?? date('Y-m-d H:i:s');
    $material->price = $data->price ?? 0;
    $material->max_stock = $data->max_stock ?? 0;

    if($material->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Material was updated."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update material."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update material. ID is missing."));
}
?>
