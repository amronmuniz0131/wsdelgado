<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Equipment.php';

$database = new Database();
$db = $database->getConnection();

$equipment = new Equipment($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $equipment->id = $data->id;
    
    // Fetch existing equipment data
    if($equipment->readOne()) {
        if(isset($data->name)) $equipment->name = $data->name;
        if(isset($data->type)) $equipment->type = $data->type;
        if(isset($data->status)) $equipment->status = $data->status;
        if(property_exists($data, 'project_id')) $equipment->project_id = $data->project_id;
        if(property_exists($data, 'operator_id')) $equipment->operator_id = $data->operator_id;
        if(property_exists($data, 'requested_by_id')) $equipment->requested_by_id = $data->requested_by_id;
        if(isset($data->estimated_hours)) $equipment->estimated_hours = $data->estimated_hours;
        if(property_exists($data, 'borrow_date')) $equipment->borrow_date = $data->borrow_date;
        if(property_exists($data, 'return_date')) $equipment->return_date = $data->return_date;
        if(isset($data->is_approved)) $equipment->is_approved = $data->is_approved;

        if($equipment->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Equipment was updated."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update equipment."));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Equipment not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update equipment. ID is missing."));
}
?>
