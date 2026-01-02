<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/Database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $user->id = $data->id;
    
    // Check if user exists first? Optional but good practice.
    // For now we trust the ID or handle failure in update.

    // Allow partial updates or require all fields?
    // Implementation in model requires name and email.
    
    if(!empty($data->name)) $user->name = $data->name;
    if(!empty($data->email)) $user->email = $data->email;

    if($user->update()){
        http_response_code(200);
        echo json_encode(array("message" => "User was updated."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update user. Data is incomplete."));
}
?>
