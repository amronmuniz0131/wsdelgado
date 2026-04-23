<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Tasks.php';

$database = new Database();
$db = $database->getConnection();

$task = new Task($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name)){
    $task->name = $data->name;
    $task->status = $data->status;
    $task->severity = $data->severity;
    $task->project_id = $data->project_id;
    $task->start_date = $data->start_date;
    $task->end_date = $data->end_date;
    $task->quantity = $data->quantity;

    if($task->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Task was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create task."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create task. Data is incomplete."));
}
?>
