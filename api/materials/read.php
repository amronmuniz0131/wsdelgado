<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Material.php';

$database = new Database();
$db = $database->getConnection();

$material = new Material($db);

$stmt = $material->read();
$num = $stmt->rowCount();

if($num > 0){
    $materials_arr = array();
    $materials_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $material_item = array(
            "id" => $id,
            "name" => $name,
            "quantity" => $quantity,
            "unit" => $unit,
            "status" => $status,
            "lastRestocked" => $last_restocked,
            "requestingEngineerId" => $requesting_engineer_id,
            "projectId" => $project_id,
            "price" => $price
        );
        array_push($materials_arr["records"], $material_item);
    }
    http_response_code(200);
    echo json_encode($materials_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>
