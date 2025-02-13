<?php

class Message {
    private $conn;
    private $table_name = "messages";

    public $id;
    public $chat_id;
    public $user_id;
    public $content;
    public $message_type;
    public $file_path;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET chat_id=:chat_id, user_id=:user_id, content=:content, 
                      message_type=:message_type, file_path=:file_path";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":chat_id", $this->chat_id);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":message_type", $this->message_type);
        $stmt->bindParam(":file_path", $this->file_path);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getByChatId($chatId) {
        $query = "SELECT m.*, u.name as user_name, u.avatar as user_avatar 
                  FROM " . $this->table_name . " m
                  JOIN users u ON m.user_id = u.id
                  WHERE m.chat_id = ?
                  ORDER BY m.created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $chatId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNewByChatId($chatId, $lastId) {
        $query = "SELECT 
                    m.*, 
                    u.name as user_name,
                    u.avatar as user_avatar
                FROM 
                    " . $this->table_name . " m
                LEFT JOIN
                    users u ON m.user_id = u.id
                WHERE 
                    m.chat_id = ? 
                    AND m.id > ?
                ORDER BY 
                    m.created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $chatId, $lastId);
        
        if($stmt->execute()) {
            $result = $stmt->get_result();
            return $result->fetch_all(MYSQLI_ASSOC);
        }
        
        return [];
    }
}

