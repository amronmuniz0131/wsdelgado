<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Positions.php';

$database = new Database();
$db = $database->getConnection();

$position = new Position($db);

$stmt = $position->read();
$num = $stmt->rowCount();

if($num > 0){
    $positions_arr = array();
    $positions_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $position_item = array(
            "id" => $id,
            "position" => $position
        );
        array_push($positions_arr["records"], $position_item);
    }
    http_response_code(200);
    echo json_encode($positions_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>
