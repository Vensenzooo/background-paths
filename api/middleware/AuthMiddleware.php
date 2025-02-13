<?php

require_once __DIR__ . '/../utils/JwtUtil.php';

class AuthMiddleware {
    public static function authenticate($request) {
        $headers = apache_request_headers();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        if (!$token) {
            http_response_code(401);
            echo json_encode(["message" => "No token provided."]);
            exit();
        }

        try {
            $decoded = JwtUtil::decode($token);
            $request->user = $decoded;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid token."]);
            exit();
        }
    }
}

