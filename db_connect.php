<?php
// db_connect.php
$host = 'localhost'; // Обычно localhost для MAMP/XAMPP
$dbname = 'khruschovpracticedb';
$username = 'root'; // По умолчанию для MAMP/XAMPP
$password = ''; // По умолчанию пустой пароль для MAMP/XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}

function getProductInfo($pdo, $productName) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE ProductName = :productName");
    $stmt->execute(['productName' => $productName]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>