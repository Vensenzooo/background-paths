<?php

class RateLimitMiddleware {
    private static $requests = [];
    private static $limit = 100; // Nombre maximum de requêtes
    private static $interval = 60; // Intervalle en secondes

    public static function check($ip) {
        $current_time = time();
        
        // Supprimer les anciennes requêtes
        self::$requests = array_filter(self::$requests, function($timestamp) use ($current_time) {
            return $timestamp > $current_time - self::$interval;
        });
        
        // Ajouter la nouvelle requête
        self::$requests[] = $current_time;
        
        // Vérifier si la limite est dépassée
        if (count(self::$requests) > self::$limit) {
            http_response_code(429);
            echo json_encode(["message" => "Too many requests. Please try again later."]);
            exit();
        }
    }
}

