<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Inquiry.php';

$database = new Database();
$db = $database->getConnection();

$inquiry = new Inquiry($db);
$stmt = $inquiry->read();
$num = $stmt->rowCount();

if($num > 0) {
    $inquiries_arr = array();
    $inquiries_arr["records"] = array();
    $inquiries_arr["unread_count"] = 0;

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        
        if($is_read == 0) {
            $inquiries_arr["unread_count"]++;
        }

        $inquiry_item = array(
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "subject" => $subject,
            "message" => html_entity_decode($message),
            "is_read" => $is_read,
            "created_at" => $created_at
        );

        array_push($inquiries_arr["records"], $inquiry_item);
    }

    http_response_code(200);
    echo json_encode($inquiries_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => array(), "unread_count" => 0, "message" => "No inquiries found."));
}
?>
