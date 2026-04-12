<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Equipment.php';

$database = new Database();
$db = $database->getConnection();

$equipment = new Equipment($db);

$stmt = $equipment->read();
$num = $stmt->rowCount();

if($num > 0){
    $equipments_arr = array();
    $equipments_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $equipment_item = array(
            "id" => $id,
            "name" => $name,
            "type" => $type,
            "status" => $status,
            "projectId" => $project_id,
            "operatorId" => $operator_id,
            "requestedById" => $requested_by_id,
            "estimatedHours" => $estimated_hours
        );
        array_push($equipments_arr["records"], $equipment_item);
    }
    http_response_code(200);
    echo json_encode($equipments_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>
