<?php
header('Content-Type: application/json');

// Подключение к базе
$dsn = 'mysql:host=localhost;dbname=khruschovpracticedb;charset=utf8';
$user = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к базе данных']);
    exit;
}

// Получение JSON-данных из тела POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный формат данных']);
    exit;
}

// Обработка каждого товара
foreach ($data['items'] as $item) {
    $name = $item['name'];
    $quantity = (int)$item['quantity'];

    if ($quantity <= 0) continue;

    // Проверка достаточного количества на складе
    $stmt = $pdo->prepare("SELECT quantity FROM products WHERE name = :name");
    $stmt->execute(['name' => $name]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        echo json_encode(['error' => "Товар '$name' не найден"]);
        exit;
    }

    if ($product['quantity'] < $quantity) {
        echo json_encode(['error' => "Недостаточно товара '$name' на складе"]);
        exit;
    }

    // Обновление количества
    $stmt = $pdo->prepare("UPDATE products SET quantity = quantity - :qty WHERE name = :name");
    $stmt->execute(['qty' => $quantity, 'name' => $name]);
}

echo json_encode(['status' => 'success']);
