<?php
include_once 'headers.php';

include_once '../config/Database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $user->id = $data->id;
    
    // Fetch existing user data
    if($user->readOne()) {
        // Update fields if provided
        if(!empty($data->name)) $user->name = $data->name;
        if(!empty($data->email)) $user->email = $data->email;
        if(!empty($data->role)) $user->role = $data->role;
        
        // Handle password separately (User model hashes it if set)
        if(!empty($data->password)) {
            $user->password = $data->password;
        } else {
            $user->password = null; // Don't update password if not provided
        }

        if($user->update()){
            http_response_code(200);
            echo json_encode(array("message" => "User was updated."));
        } else{
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update user."));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update user. Data is incomplete."));
}
?>
