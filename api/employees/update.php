<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Employee.php';

$database = new Database();
$db = $database->getConnection();

$employee = new Employee($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)){
    $employee->id = $data->id;
    $employee->employee_id = $data->employeeId ?? "";
    $employee->name = $data->name ?? "";
    $employee->position = $data->position ?? "";
    $employee->assigned_project_id = $data->assignedProjectId ?? null;
    $employee->date_of_employment = $data->dateOfEmployment ?? null;
    $employee->status = $data->status ?? "available";
    $employee->email = $data->email ?? "";
    $employee->phone = $data->phone ?? "";
    $employee->address = $data->address ?? "";
    $employee->notes = $data->notes ?? "";

    if($employee->update()){
        http_response_code(200);
        echo json_encode(array("message" => "Employee was updated."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update employee."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update employee. Data is incomplete."));
}
?>
