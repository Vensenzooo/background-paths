<?php

require_once __DIR__ . '/../models/Friend.php';

class FriendController {
    private $db;
    private $friend;

    public function __construct($db) {
        $this->db = $db;
        $this->friend = new Friend($db);
    }

    public function getFriends($userId) {
        return $this->friend->getByUserId($userId);
    }

    public function getNewFriends($userId, $lastId) {
        return $this->friend->getNewByUserId($userId, $lastId);
    }

    public function addFriend($data) {
        $this->friend->user_id = $data['userId'];
        $this->friend->friend_id = $data['friendId'];

        if ($this->friend->create()) {
            return ["message" => "Friend added successfully."];
        } else {
            return ["message" => "Unable to add friend."];
        }
    }

    public function removeFriend($data) {
        if ($this->friend->delete($data['userId'], $data['friendId'])) {
            return ["message" => "Friend removed successfully."];
        } else {
            return ["message" => "Unable to remove friend."];
        }
    }
}

