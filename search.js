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
                        const card = `
                            <div class="card">
                                <img src="products/pictures/${product.ProductName}.jpg" alt="${product.ProductName}" class="card-img">
                                <div class="card-body">
                                    <h3 class="card-title">${product.ProductName}</h3>
                                    <p class="card-text">Цена: ${product.Price} ₽</p>
                                    <p class="card-text">Количество на складе: ${product.Quantity}</p>
                                </div>
                            </div>
                        `;
                        $searchResults.append(card);
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