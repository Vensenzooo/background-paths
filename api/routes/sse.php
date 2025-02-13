<?php

require_once __DIR__ . '/../controllers/ChatController.php';
require_once __DIR__ . '/../controllers/FriendController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/CorsMiddleware.php';
require_once __DIR__ . '/../utils/SseUtil.php';

$chatController = new ChatController($db);
$friendController = new FriendController($db);

CorsMiddleware::handleCors();
AuthMiddleware::authenticate($request);

SseUtil::setupHeaders();

if (preg_match('/^\/api\/sse\/chats$/', $_SERVER['REQUEST_URI'])) {
    $lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) ? intval($_SERVER['HTTP_LAST_EVENT_ID']) : 0;
    
    while (true) {
        $chats = $chatController->getNewChats($request->user->id, $lastEventId);
        foreach ($chats as $chat) {
            SseUtil::sendEvent($chat, 'chat', $chat['id']);
            $lastEventId = $chat['id'];
        }
        
        if (connection_aborted()) {
            break;
        }
        
        sleep(2);
    }
} elseif (preg_match('/^\/api\/sse\/messages\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $chatId = $matches[1];
    $lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) ? intval($_SERVER['HTTP_LAST_EVENT_ID']) : 0;
    
    while (true) {
        $messages = $chatController->getNewMessages($chatId, $lastEventId);
        foreach ($messages as $message) {
            SseUtil::sendEvent($message, 'message', $message['id']);
            $lastEventId = $message['id'];
        }
        
        if (connection_aborted()) {
            break;
        }
        
        sleep(1);
    }
} elseif (preg_match('/^\/api\/sse\/friends$/', $_SERVER['REQUEST_URI'])) {
    $lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) ? intval($_SERVER['HTTP_LAST_EVENT_ID']) : 0;
    
    while (true) {
        $friends = $friendController->getNewFriends($request->user->id, $lastEventId);
        foreach ($friends as $friend) {
            SseUtil::sendEvent($friend, 'friend', $friend['id']);
            $lastEventId = $friend['id'];
        }
        
        if (connection_aborted()) {
            break;
        }
        
        sleep(5);
    }
}

