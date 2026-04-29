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
    
    // Load existing data first
    $employee->readOne();

    if (property_exists($data, 'employeeId')) {
        $employee->employee_id = $data->employeeId;
    }
    if (property_exists($data, 'name')) {
        $employee->name = $data->name;
    }
    if (property_exists($data, 'position')) {
        $employee->position = $data->position;
    }
    if (property_exists($data, 'assignedProjectId')) {
        $employee->assigned_project_id = $data->assignedProjectId;
    }
    if (property_exists($data, 'dateOfEmployment')) {
        $employee->date_of_employment = $data->dateOfEmployment;
    }
    if (property_exists($data, 'status')) {
        $employee->status = $data->status;
    }
    if (property_exists($data, 'email')) {
        $employee->email = $data->email;
    }
    if (property_exists($data, 'phone')) {
        $employee->phone = $data->phone;
    }
    if (property_exists($data, 'address')) {
        $employee->address = $data->address;
    }
    if (property_exists($data, 'notes')) {
        $employee->notes = $data->notes;
    }

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
