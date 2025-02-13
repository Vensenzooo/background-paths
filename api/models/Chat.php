<?php

class Chat {
    private $conn;
    private $table_name = "chats";

    public $id;
    public $name;
    public $created_by;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, created_by=:created_by, created_at=:created_at";
        $stmt = $this->conn->prepare($query);

        $this->created_at = date('Y-m-d H:i:s');

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":created_by", $this->created_by);
        $stmt->bindParam(":created_at", $this->created_at);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getByUserId($userId) {
        $query = "SELECT c.* FROM " . $this->table_name . " c
                  JOIN chat_users cu ON c.id = cu.chat_id
                  WHERE cu.user_id = ?
                  ORDER BY c.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $userId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNewByUserId($userId, $lastId) {
        $query = "SELECT c.* FROM " . $this->table_name . " c
                  JOIN chat_users cu ON c.id = cu.chat_id
                  WHERE cu.user_id = ? AND c.id > ?
                  ORDER BY c.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $userId);
        $stmt->bindParam(2, $lastId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

