<?php

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';

$authController = new AuthController($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    CorsMiddleware::handleCors();
    
    $data = json_decode(file_get_contents("php://input"), true);

    if ($_SERVER['REQUEST_URI'] === '/api/auth/register') {
        $result = $authController->register($data);
        echo json_encode($result);
    } elseif ($_SERVER['REQUEST_URI'] === '/api/auth/login') {
        $result = $authController->login($data);
        echo json_encode($result);
    }
}

