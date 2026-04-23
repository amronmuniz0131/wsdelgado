<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Tasks.php';

$database = new Database();
$db = $database->getConnection();

$task = new Task($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $task->id = $data->id;
    $task->readOne();

    if (property_exists($data, 'name')) {
        $task->name = $data->name;
    }
    if (property_exists($data, 'status')) {
        $task->status = $data->status;
    }
    if (property_exists($data, 'severity')) {
        $task->severity = $data->severity;
    }
    if (property_exists($data, 'project_id')) {
        $task->project_id = $data->project_id;
    }
    if (property_exists($data, 'start_date')) {
        $task->start_date = $data->start_date;
    }
    if (property_exists($data, 'end_date')) {
        $task->end_date = $data->end_date;
    }
    if (property_exists($data, 'quantity')) {
        $task->quantity = $data->quantity;
    }

    if($task->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Task was updated."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update task."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update task. ID is missing."));
}
?>
