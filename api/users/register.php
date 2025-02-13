<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

try {
    $input = file_get_contents('php://input');
    error_log("Received input: " . $input); // Debug log
    
    $data = json_decode($input);

    if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->password)) {
        throw new Exception('Missing required fields');
    }

    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("s", $data->email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if($check_result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Email already exists']);
        exit();
    }
    
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    $avatar = "https://api.dicebear.com/7.x/initials/svg?seed=" . urlencode($data->name);
    
    $query = "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssss", $data->name, $data->email, $hashed_password, $avatar);
    
    if($stmt->execute()) {
        $id = $stmt->insert_id;
        http_response_code(201);
        echo json_encode([
            'id' => $id,
            'name' => $data->name,
            'email' => $data->email,
            'avatar' => $avatar,
            'message' => 'User created successfully'
        ]);
        exit();
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'message' => $e->getMessage(),
        'debug' => error_get_last()
    ]);
}
