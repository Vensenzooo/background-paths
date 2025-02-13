<?php

require_once __DIR__ . '/../models/Message.php';
require_once __DIR__ . '/../models/FileMetadata.php';
require_once __DIR__ . '/../utils/FileUploader.php';

class MessageController {
    private $db;
    private $message;
    private $fileMetadata;

    public function __construct($db) {
        $this->db = $db;
        $this->message = new Message($db);
        $this->fileMetadata = new FileMetadata($db);
    }

    public function sendMessage($data) {
        $this->message->chat_id = $data['chatId'];
        $this->message->user_id = $data['userId'];
        $this->message->content = $data['content'];
        $this->message->message_type = $data['messageType'];

        if ($data['messageType'] !== 'text') {
            $file = $data['file'];
            $uploadResult = FileUploader::upload($file, $data['messageType']);
            if ($uploadResult['success']) {
                $this->message->file_path = $uploadResult['filePath'];
            } else {
                return ["error" => "File upload failed: " . $uploadResult['error']];
            }
        }

        if ($this->message->create()) {
            if ($data['messageType'] !== 'text') {
                $this->fileMetadata->message_id = $this->message->id;
                $this->fileMetadata->original_filename = $file['name'];
                $this->fileMetadata->file_size = $file['size'];
                $this->fileMetadata->mime_type = $file['type'];
                $this->fileMetadata->create();
            }
            return ["message" => "Message sent successfully.", "id" => $this->message->id];
        } else {
            return ["error" => "Unable to send message."];
        }
    }

    public function getMessages($chatId) {
        $messages = $this->message->getByChatId($chatId);
        foreach ($messages as &$message) {
            if ($message['message_type'] !== 'text') {
                $metadata = $this->fileMetadata->getByMessageId($message['id']);
                $message['file_metadata'] = $metadata;
            }
        }
        return $messages;
    }
}

