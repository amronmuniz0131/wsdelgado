<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Employee.php';

$database = new Database();
$db = $database->getConnection();

$employee = new Employee($db);

$stmt = $employee->read();
$num = $stmt->rowCount();

if($num > 0){
    $employees_arr = array();
    $employees_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $employee_item = array(
            "id" => $id,
            "employeeId" => $employee_id,
            "name" => $name,
            "position" => $position,
            "assignedProjectId" => $assigned_project_id,
            "assignedProject" => $project_name,
            "dateOfEmployment" => $date_of_employment,
            "status" => $status,
            "email" => $email,
            "phone" => $phone,
            "address" => $address,
            "notes" => $notes
        );
        array_push($employees_arr["records"], $employee_item);
    }
    http_response_code(200);
    echo json_encode($employees_arr);
} else {
    http_response_code(200); // Return empty array instead of 404 for easier frontend handling
    echo json_encode(array("records" => []));
}
?>
