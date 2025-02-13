<?php

require_once __DIR__ . '/../models/Chat.php';
require_once __DIR__ . '/../models/Message.php';

class ChatController {
    private $db;
    private $chat;
    private $message;

    public function __construct($db) {
        $this->db = $db;
        $this->chat = new Chat($db);
        $this->message = new Message($db);
    }

    public function getChats($userId) {
        return $this->chat->getByUserId($userId);
    }

    public function getNewChats($userId, $lastId) {
        return $this->chat->getNewByUserId($userId, $lastId);
    }

    public function createChat($data) {
        $this->chat->name = $data['name'];
        $this->chat->created_by = $data['userId'];

        if ($this->chat->create()) {
            return ["message" => "Chat created successfully.", "id" => $this->chat->id];
        } else {
            return ["message" => "Unable to create chat."];
        }
    }

    public function getMessages($chatId) {
        return $this->message->getByChatId($chatId);
    }

    public function getNewMessages($chatId, $lastId) {
        return $this->message->getNewByChatId($chatId, $lastId);
    }

    public function sendMessage($data) {
        $this->message->chat_id = $data['chatId'];
        $this->message->user_id = $data['userId'];
        $this->message->content = $data['content'];

        if ($this->message->create()) {
            return ["message" => "Message sent successfully.", "id" => $this->message->id];
        } else {
            return ["message" => "Unable to send message."];
        }
    }
}

