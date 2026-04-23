<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Requests.php';

$database = new Database();
$db = $database->getConnection();

$request = new Requests($db);

$stmt = $request->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $requests_arr = array();
    $requests_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $request_item = array(
            "id" => $id,
            "material_id" => $material_id,
            "material_name" => $material_name,
            "quantity" => $quantity,
            "engineer_id" => $engineer_id,
            "engineer_name" => $engineer_name,
            "project_id" => $project_id,
            "project_name" => $project_name,
            "request_date" => $request_date,
            "is_approve" => $is_approve
        );
        array_push($requests_arr["records"], $request_item);
    }
    http_response_code(200);
    echo json_encode($requests_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>