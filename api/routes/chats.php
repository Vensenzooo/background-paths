<?php

require_once __DIR__ . '/../controllers/ChatController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';

$request = json_decode(file_get_contents('php://input'));
$chatController = new ChatController($db);

CorsMiddleware::handleCors();
AuthMiddleware::authenticate($request);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (preg_match('/^\/api\/chats$/', $_SERVER['REQUEST_URI'])) {
        $result = $chatController->getChats($request->user->id);
        echo json_encode($result);
    } elseif (preg_match('/^\/api\/chats\/(\d+)\/messages$/', $_SERVER['REQUEST_URI'], $matches)) {
        $chatId = $matches[1];
        $result = $chatController->getMessages($chatId);
        echo json_encode($result);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (preg_match('/^\/api\/chats$/', $_SERVER['REQUEST_URI'])) {
        $data['userId'] = $request->user->id;
        $result = $chatController->createChat($data);
        echo json_encode($result);
    } elseif (preg_match('/^\/api\/chats\/(\d+)\/messages$/', $_SERVER['REQUEST_URI'], $matches)) {
        $chatId = $matches[1];
        $data['chatId'] = $chatId;
        $data['userId'] = $request->user->id;
        $result = $chatController->sendMessage($data);
        echo json_encode($result);
    }
}

