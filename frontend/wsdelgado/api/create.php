<?php
include_once 'headers.php';

include_once '../config/Database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password)
){
    $user->name = $data->name;
    $user->email = $data->email;
    $user->password = $data->password;
    $user->role = !empty($data->role) ? $data->role : "user";

    if($user->create()){
        http_response_code(201);
        echo json_encode(array("message" => "User was created."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create user."));
    }
} else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>
