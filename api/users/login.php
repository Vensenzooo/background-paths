<?php
// Prevent any HTML error output
error_reporting(0);
ini_set('display_errors', 0);

// Set headers before any possible error occurs
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Custom error handler
function jsonError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Set custom error handler
set_error_handler(function($errno, $errstr) {
    jsonError($errstr);
});

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once '../db.php';
    
    // Get and validate input
    $input = file_get_contents('php://input');
    if (!$input) {
        jsonError('No input provided', 400);
    }

    $data = json_decode($input);
    if (!$data || !isset($data->email) || !isset($data->password)) {
        jsonError('Invalid credentials', 400);
    }

    // Query user
    $query = "SELECT id, name, email, password, avatar FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        jsonError('Database error', 500);
    }

    $stmt->bind_param("s", $data->email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        if (password_verify($data->password, $user['password'])) {
            unset($user['password']);
            echo json_encode($user);
            exit;
        }
    }

    jsonError('Invalid credentials', 401);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    jsonError('Authentication failed', 401);
}
