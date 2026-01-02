<?php
function callAPI($method, $url, $data = false){
    $curl = curl_init();
    switch ($method){
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }
    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    
    $result = curl_exec($curl);
    
    // Check HTTP status code
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    curl_close($curl);
    return ["code" => $httpcode, "response" => $result];
}

$baseUrl = "http://localhost/wsdelgado/api";

echo "1. Testing Create User...\n";
$data_create = json_encode(["name" => "Test User", "email" => "test@test.com"]);
$res = callAPI("POST", "$baseUrl/create.php", $data_create);
echo "Status: " . $res['code'] . "\nResponse: " . $res['response'] . "\n\n";

echo "2. Testing Read Users...\n";
$res = callAPI("GET", "$baseUrl/read.php");
echo "Status: " . $res['code'] . "\nResponse: " . $res['response'] . "\n\n";

// Get ID from read response (naive parsing, just taking the first one if exists)
$users = json_decode($res['response'], true);
$id = 1; // Default
if(isset($users['records'][0]['id'])){
    $id = $users['records'][0]['id'];
}

echo "3. Testing Single Read (ID: $id)...\n";
$res = callAPI("GET", "$baseUrl/single_read.php?id=$id");
echo "Status: " . $res['code'] . "\nResponse: " . $res['response'] . "\n\n";

echo "4. Testing Update User (ID: $id)...\n";
$data_update = json_encode(["id" => $id, "name" => "Updated User", "email" => "updated@test.com"]);
$res = callAPI("POST", "$baseUrl/update.php", $data_update);
echo "Status: " . $res['code'] . "\nResponse: " . $res['response'] . "\n\n";

echo "5. Testing Delete User (ID: $id)...\n";
$data_delete = json_encode(["id" => $id]);
$res = callAPI("POST", "$baseUrl/delete.php", $data_delete);
echo "Status: " . $res['code'] . "\nResponse: " . $res['response'] . "\n\n";

?>
