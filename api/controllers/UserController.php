<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/AvatarGenerator.php';

class UserController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function getUser($id) {
        $user = $this->user->getById($id);
        if ($user) {
            unset($user['password']);
            return $user;
        } else {
            return ["message" => "User not found."];
        }
    }

    public function updateUser($id, $data) {
        $this->user->id = $id;
        $this->user->name = $data['name'];
        $this->user->email = $data['email'];

        if ($this->user->update()) {
            return ["message" => "User updated successfully."];
        } else {
            return ["message" => "Unable to update user."];
        }
    }

    public function createUser($data) {
        $this->user->name = $data['name'];
        $this->user->email = $data['email'];
        $this->user->password = password_hash($data['password'], PASSWORD_DEFAULT);
        $this->user->avatar = AvatarGenerator::generate($data['email']);

        if ($this->user->create()) {
            return ["message" => "User created successfully.", "id" => $this->user->id];
        } else {
            return ["message" => "Unable to create user."];
        }
    }
}

