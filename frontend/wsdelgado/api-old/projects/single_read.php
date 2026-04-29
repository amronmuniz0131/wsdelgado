<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Project.php';

$database = new Database();
$db = $database->getConnection();

$project = new Project($db);

$project->id = isset($_GET['id']) ? $_GET['id'] : die();

if($project->readOne()){
    $project_arr = array(
        "id" => $project->id,
        "name" => $project->name,
        "location" => $project->location,
        "client" => $project->client,
        "address" => $project->address,
        "progress" => $project->progress,
        "foreman_id" => $project->foreman_id,
        "engineer_id" => $project->engineer_id,
        "foreman_name" => $project->foreman_name,
        "engineer_name" => $project->engineer_name,
        "client_name" => $project->client_name,
        "created_at" => $project->created_at,
        "updated_at" => $project->updated_at,
        "start_date" => $project->start_date,
        "end_date" => $project->end_date,
        "completion_date" => $project->completion_date
    );
    http_response_code(200);
    echo json_encode($project_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Project does not exist."));
}
?>
