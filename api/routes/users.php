<?php

require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';

$userController = new UserController($db);

CorsMiddleware::handleCors();
AuthMiddleware::authenticate($request);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $userController->getUser($request->user->id);
    echo json_encode($result);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $result = $userController->updateUser($request->user->id, $data);
    echo json_encode($result);
}

