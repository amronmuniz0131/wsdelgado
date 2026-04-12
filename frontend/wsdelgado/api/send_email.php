<?php
include_once 'headers.php';

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->subject) &&
    !empty($data->message)
){
    // In a real application, you might want to send this to a specific admin email
    $to = "wsdelgado2026@gmail.com"; 
    
    // Sanitize input
    $name = htmlspecialchars(strip_tags($data->name));
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    $subject_input = htmlspecialchars(strip_tags($data->subject));
    $message_input = htmlspecialchars(strip_tags($data->message));

    $subject = "Contact Form: " . $subject_input;
    $message = "You received a new message from the contact form.\n\n".
               "Name: " . $name . "\n".
               "Email: " . $email . "\n\n".
               "Message:\n" . $message_input;
               
    $headers = "From: wsdelgado2026@gmail.com\r\n" .
               "Reply-To: " . $email . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // Using PHP mail() which relies on XAMPP sendmail configuration
    if(mail($to, $subject, $message, $headers)){
        http_response_code(200);
        echo json_encode(array("message" => "Email was sent successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to send email. Ensure XAMPP SMTP is configured."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to send email. Data is incomplete."));
}
?>
