<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/TaskHistory.php';

$database = new Database();
$db = $database->getConnection();

$taskHistory = new TaskHistory($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->task_id) && !empty($data->employee_id)) {
    // If employee_id is an array (multiple assign)
    if (is_array($data->employee_id)) {
        $success = true;
        foreach($data->employee_id as $emp_id) {
            $taskHistory->task_id = $data->task_id;
            $taskHistory->employee_id = $emp_id;
            if(!$taskHistory->create()) {
                $success = false;
            }
        }
        if($success) {
            http_response_code(201);
            echo json_encode(array("message" => "Assignments created successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create some or all assignments."));
        }
    } else {
        // Single assign
        $taskHistory->task_id = $data->task_id;
        $taskHistory->employee_id = $data->employee_id;

        if($taskHistory->create()){
            http_response_code(201);
            echo json_encode(array("message" => "Assignment created."));
        } else{
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create assignment."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create assignment. Data is incomplete."));
}
?>
