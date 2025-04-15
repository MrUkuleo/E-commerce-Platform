<?php
header('Content-Type: application/json');

// Include database connection
require_once 'db_connect.php';

// Function to update stock quantity
function updateStock($pdo, $productName, $quantityPurchased) {
    try {
        // Fetch current product details
        $stmt = $pdo->prepare("SELECT Quantity FROM products WHERE ProductName = :productName");
        $stmt->execute(['productName' => $productName]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception("Product not found: $productName");
        }

        $currentQuantity = $product['Quantity'];
        $newQuantity = $currentQuantity - $quantityPurchased;

        if ($newQuantity < 0) {
            throw new Exception("Insufficient stock for $productName. Available: $currentQuantity, Requested: $quantityPurchased");
        }

        // Update the quantity in the database
        $updateStmt = $pdo->prepare("UPDATE products SET Quantity = :newQuantity WHERE ProductName = :productName");
        $updateStmt->execute([
            'newQuantity' => $newQuantity,
            'productName' => $productName
        ]);

        return true;
    } catch (Exception $e) {
        throw $e;
    }
}

try {
    // Get the raw POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data || !isset($data['items'])) {
        throw new Exception("Invalid request data");
    }

    $items = $data['items'];

    // Begin a transaction to ensure all updates succeed or fail together
    $pdo->beginTransaction();

    // Update stock for each item
    foreach ($items as $item) {
        if (!isset($item['name']) || !isset($item['quantity'])) {
            throw new Exception("Missing item data");
        }

        $productName = $item['name'];
        $quantityPurchased = $item['quantity'];

        updateStock($pdo, $productName, $quantityPurchased);
    }

    // Commit the transaction
    $pdo->commit();

    // Send success response
    echo json_encode(['success' => true, 'message' => 'Stock updated successfully']);
} catch (Exception $e) {
    // Roll back the transaction on error
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>