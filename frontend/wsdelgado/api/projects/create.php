<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Project.php';

$database = new Database();
$db = $database->getConnection();

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name)){
    $project->name = $data->name;
    $project->location = $data->location ?? "";
    $project->client = $data->client ?? "";
    $project->address = $data->address ?? "";
    $project->progress = $data->progress ?? 0;
    $project->foreman_id = $data->foremanId ?? null;
    $project->engineer_id = $data->engineerId ?? null;

    if($project->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Project was created.", "id" => $project->id));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create project."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create project. Data is incomplete."));
}
?>
