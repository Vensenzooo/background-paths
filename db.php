<?php

function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception("The .env.local file does not exist.");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $_ENV[$name] = trim($value);
    }
}

loadEnv(__DIR__ . '/.env.local');

$databaseUrl = $_ENV['DATABASE_URL'];
$dbparts = parse_url($databaseUrl);

$servername = $dbparts['host'];
$username = $dbparts['user'];
$password = $dbparts['pass'];
$dbname = ltrim($dbparts['path'], '/');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully";
?>
