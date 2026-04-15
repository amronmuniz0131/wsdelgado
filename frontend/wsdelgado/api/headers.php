<?php
// Note: CORS headers are now handled by .htaccess for better reliability
// header("Access-Control-Allow-Origin: ..."); // Handled by .htaccess

header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request if it reaches here
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
