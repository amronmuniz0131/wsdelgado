<?php
include_once 'headers.php';

include_once '../config/Database.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$stmt = $user->read();
$num = $stmt->rowCount();

if($num > 0){
    $users_arr = array();
    $users_arr["records"] = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $user_item = array(
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "password" => $password,
            "role" => $role,
            "created_at" => $created_at
        );
        array_push($users_arr["records"], $user_item);
    }
    http_response_code(200);
    echo json_encode($users_arr);
} else{
    http_response_code(404);
    echo json_encode(array("message" => "No users found."));
}
?>
