<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Equipment.php';

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit;
}

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
            "projectName" => $project_name,
            "operatorId" => $operator_id,
            "operator" => $operator_name,
            "requestedById" => $requested_by_id,
            "requestedBy" => $requested_by_name,
            "borrowDate" => $borrow_date,
            "returnDate" => $return_date,
            "is_approved" => $is_approved,
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
