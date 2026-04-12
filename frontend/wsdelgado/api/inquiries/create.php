<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Inquiry.php';

$database = new Database();
$db = $database->getConnection();

$inquiry = new Inquiry($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->email) && !empty($data->subject) && !empty($data->message)) {
    $inquiry->name = $data->name;
    $inquiry->email = $data->email;
    $inquiry->subject = $data->subject;
    $inquiry->message = $data->message;

    if($inquiry->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Inquiry was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create inquiry."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create inquiry. Data is incomplete."));
}
?>
