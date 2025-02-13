<?php

class AvatarGenerator {
    public static function generate($email) {
        $hash = md5(strtolower(trim($email)));
        $color = substr($hash, 0, 6);
        $initials = strtoupper(substr($email, 0, 2));
        
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">';
        $svg .= '<rect width="100" height="100" fill="#' . $color . '"/>';
        $svg .= '<text x="50" y="50" font-size="50" text-anchor="middle" dy=".3em" fill="#ffffff">' . $initials . '</text>';
        $svg .= '</svg>';
        
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}

