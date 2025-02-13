<?php

class SseUtil {
    public static function setupHeaders() {
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no'); // Désactive la mise en mémoire tampon pour Nginx
    }

    public static function sendEvent($data, $event = null, $id = null) {
        echo "data: " . json_encode($data) . "\n";
        if ($event !== null) {
            echo "event: $event\n";
        }
        if ($id !== null) {
            echo "id: $id\n";
        }
        echo "\n";
        ob_flush();
        flush();
    }
}

