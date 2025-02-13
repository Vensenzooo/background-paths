<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/CorsMiddleware.php';

// Gérer les requêtes CORS
CorsMiddleware::handleCors();

// Connexion à la base de données
$database = new Database();
$db = $database->getConnection();

// Router simple
$request_uri = $_SERVER['REQUEST_URI'];

if (strpos($request_uri, '/api/auth') === 0) {
    require __DIR__ . '/routes/auth.php';
} elseif (strpos($request_uri, '/api/chats') === 0) {
    require __DIR__ . '/routes/chats.php';
} elseif (strpos($request_uri, '/api/friends') === 0) {
    require __DIR__ . '/routes/friends.php';
} elseif (strpos($request_uri, '/api/users') === 0) {
    require __DIR__ . '/routes/users.php';
} elseif (strpos($request_uri, '/api/sse') === 0) {
    require __DIR__ . '/routes/sse.php';
} else {
    http_response_code(404);
    echo json_encode(["message" => "Route not found"]);
}

