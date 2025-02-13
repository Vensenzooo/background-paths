<?php

require_once __DIR__ . '/../controllers/FriendController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';

$friendController = new FriendController($db);

CorsMiddleware::handleCors();
AuthMiddleware::authenticate($request);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $friendController->getFriends($request->user->id);
    echo json_encode($result);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $data['userId'] = $request->user->id;
    $result = $friendController->addFriend($data);
    echo json_encode($result);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $data['userId'] = $request->user->id;
    $result = $friendController->removeFriend($data);
    echo json_encode($result);
}

