<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Project.php';

$database = new Database();
$db = $database->getConnection();

$project = new Project($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $project->id = $data->id;
    
    // Fetch existing project data
    if($project->readOne()) {
        // Update fields if provided
        if(property_exists($data, 'name')) $project->name = $data->name;
        if(property_exists($data, 'location')) $project->location = $data->location;
        if(property_exists($data, 'client')) $project->client = $data->client;
        if(property_exists($data, 'address')) $project->address = $data->address;
        if(property_exists($data, 'progress')) $project->progress = $data->progress;
        if(property_exists($data, 'foreman_id')) $project->foreman_id = $data->foreman_id;
        if(property_exists($data, 'engineer_id')) $project->engineer_id = $data->engineer_id;
        if(property_exists($data, 'start_date')) $project->start_date = $data->start_date;
        if(property_exists($data, 'end_date')) $project->end_date = $data->end_date;
        if(property_exists($data, 'completion_date')) $project->completion_date = $data->completion_date;

        if($project->update()){
            http_response_code(200);
            echo json_encode(array("message" => "Project was updated."));
        } else{
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update project."));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Project not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update project. Data is incomplete."));
}
?>
