<?php

class FileMetadata {
    private $conn;
    private $table_name = "file_metadata";

    public $id;
    public $message_id;
    public $original_filename;
    public $file_size;
    public $mime_type;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET message_id=:message_id, original_filename=:original_filename, 
                      file_size=:file_size, mime_type=:mime_type";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":message_id", $this->message_id);
        $stmt->bindParam(":original_filename", $this->original_filename);
        $stmt->bindParam(":file_size", $this->file_size);
        $stmt->bindParam(":mime_type", $this->mime_type);

        return $stmt->execute();
    }

    public function getByMessageId($messageId) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE message_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $messageId);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

