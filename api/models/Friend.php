<?php

class Friend {
    private $conn;
    private $table_name = "friends";

    public $id;
    public $user_id;
    public $friend_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET user_id=:user_id, friend_id=:friend_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":friend_id", $this->friend_id);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getByUserId($userId) {
        $query = "SELECT u.* FROM users u
                  JOIN " . $this->table_name . " f ON u.id = f.friend_id
                  WHERE f.user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $userId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNewByUserId($userId, $lastId) {
        $query = "SELECT u.* FROM users u
                  JOIN " . $this->table_name . " f ON u.id = f.friend_id
                  WHERE f.user_id = ? AND f.id > ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $userId);
        $stmt->bindParam(2, $lastId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function delete($userId, $friendId) {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = :user_id AND friend_id = :friend_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $userId);
        $stmt->bindParam(":friend_id", $friendId);

        return $stmt->execute();
    }
}

