<?php
// get_product_info.php
require_once '../db_connect.php';

header('Content-Type: application/json');

// Проверка, передано ли имя товара
if (isset($_GET['product_name'])) {
    $productName = trim($_GET['product_name']);
    $product = getProductInfo($pdo, $productName);

    if ($product) {
        echo json_encode([
            'description' => $product['Description'],
            'price' => $product['Price'],
            'quantity' => $product['Quantity']
        ]);
    } else {
        echo json_encode(['error' => 'Товар не найден в базе данных']);
    }
} else {
    echo json_encode(['error' => 'Не указано название товара']);
}
?>
