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

    if($task->delete()){
        http_response_code(200);
        echo json_encode(array("message" => "Task was deleted."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete task."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete task. Data is incomplete."));
}
?>
