<?php
header('Content-Type: application/json');

// Подключаем соединение с базой данных
require_once 'db_connect.php';

try {
    // Получаем поисковый запрос из параметра GET
    $searchQuery = isset($_GET['query']) ? trim($_GET['query']) : '';

    if (empty($searchQuery)) {
        echo json_encode(['success' => false, 'message' => 'Введите запрос для поиска']);
        exit;
    }

    // Подготавливаем SQL-запрос для поиска товаров по названию
    $stmt = $pdo->prepare("SELECT * FROM products WHERE ProductName LIKE :searchQuery");
    $stmt->execute(['searchQuery' => "%$searchQuery%"]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($products)) {
        echo json_encode(['success' => false, 'message' => 'Товары не найдены']);
    } else {
        echo json_encode(['success' => true, 'products' => $products]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка при поиске: ' . $e->getMessage()]);
}
?>