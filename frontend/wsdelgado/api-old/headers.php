<?php
/**
 * CORS Headers for Hostinger LiteSpeed Server
 * This file handles preflight requests and allows cross-origin access.
 */

// 1. Set the main CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
header("Access-Control-Allow-Credentials: false");
header("X-CORS-Debug: Antigravity-v2-AllAllowed");

// 2. Handle preflight (OPTIONS) requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
    header("X-CORS-Debug-Preflight: true");
    http_response_code(200);
    exit;
}

// 3. Standard JSON content type for API responses
header("Content-Type: application/json; charset=UTF-8");
