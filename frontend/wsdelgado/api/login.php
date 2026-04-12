<?php
include_once 'headers.php';

include_once '../config/Database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)){
    if($user->login($data->email, $data->password)){
        http_response_code(200);
        echo json_encode(array(
            "message" => "Login successful.",
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email,
            "role" => $user->role
        ));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Login failed. Invalid email or password."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Login failed. Incomplete data."));
}
?>
