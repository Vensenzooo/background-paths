<?php

class FileUploader {
    private static $uploadDirectory = '/path/to/your/upload/directory/';

    public static function upload($file, $messageType) {
        $targetDir = self::$uploadDirectory . $messageType . '/';
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $fileName = uniqid() . '_' . basename($file['name']);
        $targetFile = $targetDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            return [
                'success' => true,
                'filePath' => $messageType . '/' . $fileName
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Sorry, there was an error uploading your file.'
            ];
        }
    }
}

