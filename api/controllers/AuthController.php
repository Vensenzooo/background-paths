<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtUtil.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function register($data) {
        $this->user->name = $data['name'];
        $this->user->email = $data['email'];
        $this->user->password = password_hash($data['password'], PASSWORD_BCRYPT);

        if ($this->user->create()) {
            return ["message" => "User registered successfully."];
        } else {
            return ["message" => "Unable to register user."];
        }
    }

    public function login($data) {
        $email = $data['email'];
        $password = $data['password'];

        $user = $this->user->getByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            $token = JwtUtil::encode([
                "id" => $user['id'],
                "email" => $user['email']
            ]);

            return [
                "message" => "Login successful.",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email']
                ]
            ];
        } else {
            return ["message" => "Invalid credentials."];
        }
    }
}

