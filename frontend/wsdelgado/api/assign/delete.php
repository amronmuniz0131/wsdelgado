<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/TaskHistory.php';

$database = new Database();
$db = $database->getConnection();

$taskHistory = new TaskHistory($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->task_id) && !empty($data->employee_id)) {
    $taskHistory->task_id = $data->task_id;
    $taskHistory->employee_id = $data->employee_id;

    if($taskHistory->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Assignment was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete assignment."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete assignment. Data is incomplete."));
}
?>
