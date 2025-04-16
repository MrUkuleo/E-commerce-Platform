$(document).ready(function () {
    // Обрабатываем клик по кнопке "Найти"
    $('.search button').click(function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение кнопки

        const searchQuery = $('.search input').val().trim();
        const $searchResults = $('#search-results');

        // Очищаем предыдущие результаты
        $searchResults.empty();

        if (!searchQuery) {
            $searchResults.html('<p>Введите запрос для поиска</p>');
            return;
        }

        // Отправляем AJAX-запрос на search.php
        $.ajax({
            url: 'search.php',
            method: 'GET',
            data: { query: searchQuery },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Отображаем найденные товары
                    response.products.forEach(product => {
                        // Определяем URL страницы товара на основе названия
                        let productUrl = '';
                        const productName = product.ProductName.toLowerCase();

                        if (productName.includes('видеокарта')) {
                            productUrl = 'products/gpu.html';
                        } else if (productName.includes('процессор')) {
                            productUrl = 'products/cpu.html';
                        } else if (productName.includes('материнская плата')) {
                            productUrl = 'products/mboard.html';
                        } else if (productName.includes('блок питания')) {
                            productUrl = 'products/bp.html';
                        } else if (productName.includes('signature line')) {
                            productUrl = 'products/ram.html';
                        } else {
                            // Если категория не определена, можно указать страницу по умолчанию или оставить пустым
                            productUrl = '#';
                        }

                        // Создаём элемент с ссылкой
                        const foundProduct = `
                            <a href="${productUrl}" class="found-product">
                                <img src="products/pictures/${product.ProductName}.jpg" alt="${product.ProductName}" class="card-img">
                                <h3 class="card-title">${product.ProductName}</h3>
                            </a>
                        `;
                        $searchResults.append(foundProduct);
                    });
                } else {
                    // Отображаем сообщение, если товары не найдены
                    $searchResults.html('<p>' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $searchResults.html('<p>Произошла ошибка при поиске. Попробуйте снова.</p>');
                console.log('Ошибка AJAX:', xhr, status, error);
            }
        });
    });

    // Дополнительно: очистка результатов при изменении текста в поле ввода
    $('.search input').on('input', function () {
        $('#search-results').empty();
    });
});