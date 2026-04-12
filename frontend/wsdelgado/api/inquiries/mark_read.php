<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Inquiry.php';

$database = new Database();
$db = $database->getConnection();

$inquiry = new Inquiry($db);
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $inquiry->id = $data->id;

    if($inquiry->markAsRead()) {
        http_response_code(200);
        echo json_encode(array("message" => "Inquiry marked as read."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to mark inquiry as read."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to mark as read. Data is incomplete."));
}
?>
