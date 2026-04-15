<?php
include_once '../headers.php';
include_once '../../config/Database.php';
include_once '../../models/Project.php';

$database = new Database();
$db = $database->getConnection();

$project = new Project($db);

$stmt = $project->read();
$num = $stmt->rowCount();

if($num > 0){
    $projects_arr = array();
    $projects_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $project_item = array(
            "id" => $id,
            "name" => $name,
            "location" => $location,
            "client" => $client,
            "address" => $address,
            "progress" => $progress,
            "foremanId" => $foreman_id,
            "engineerId" => $engineer_id,
            "foremanName" => $foreman_name,
            "engineerName" => $engineer_name,
            "clientName" => $client_name
        );
        array_push($projects_arr["records"], $project_item);
    }
    http_response_code(200);
    echo json_encode($projects_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => []));
}
?>
