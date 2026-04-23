<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Tasks.php';

$database = new Database();
$db = $database->getConnection();

$task = new Task($db);

$stmt = $task->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $tasks_arr = array();
    $tasks_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $task_item = array(
            "id" => $id,
            "name" => $name,
            "status" => $status,
            "severity" => $severity,
            "project_id" => $project_id,
            "project_name" => $project_name,
            "start_date" => $start_date,
            "end_date" => $end_date,
            "quantity" => $quantity
        );
        array_push($tasks_arr["records"], $task_item);
    }
    http_response_code(200);
    echo json_encode($tasks_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>
