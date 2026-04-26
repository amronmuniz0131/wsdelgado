<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/TaskHistory.php';

$database = new Database();
$db = $database->getConnection();

$taskHistory = new TaskHistory($db);

// Check if task_id is provided to filter by task
if(isset($_GET['task_id'])) {
    $taskHistory->task_id = $_GET['task_id'];
    $stmt = $taskHistory->readByTask();
} else {
    $stmt = $taskHistory->read();
}

$num = $stmt->rowCount();

if($num > 0) {
    $history_arr = array();
    $history_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $history_item = array(
            "id" => $id,
            "task_id" => $task_id,
            "employee_id" => $employee_id,
            "employee_name" => isset($employee_name) ? $employee_name : null,
            "task_name" => isset($task_name) ? $task_name : null,
            "project_name" => isset($project_name) ? $project_name : null,
            "created_at" => $created_at
        );
        array_push($history_arr["records"], $history_item);
    }
    http_response_code(200);
    echo json_encode($history_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>
