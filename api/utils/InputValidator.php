<?php

class InputValidator {
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public static function sanitizeString($string) {
        return htmlspecialchars(strip_tags($string));
    }

    public static function validatePassword($password) {
        // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password);
    }
}

