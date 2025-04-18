$(document).ready(function () {
    $('.search button').click(function (event) {
        event.preventDefault();

        const searchQuery = $('.search input').val().trim();
        const $searchResults = $('#search-results');

        $searchResults.empty();

        if (!searchQuery) {
            $searchResults.html('<p>Введите запрос для поиска</p>');
            return;
        }

        $.ajax({
            url: '../search.php',
            method: 'GET',
            data: { query: searchQuery },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    response.products.forEach(product => {
                        let productUrl = '';
                        const productName = product.ProductName.toLowerCase();

                        if (productName.includes('видеокарта')) {
                            productUrl = 'gpu.html';
                        } else if (productName.includes('процессор')) {
                            productUrl = 'cpu.html';
                        } else if (productName.includes('материнская плата')) {
                            productUrl = 'mboard.html';
                        } else if (productName.includes('блок питания')) {
                            productUrl = 'bp.html';
                        } else if (productName.includes('signature line')) {
                            productUrl = 'ram.html';
                        } else {
                            productUrl = '#';
                        }

                        const foundProduct = `
                            <a href="${productUrl}" class="found-product">
                                <img src="pictures/${product.ProductName}.jpg" alt="${product.ProductName}" class="card-img">
                                <h3 class="card-title">${product.ProductName}</h3>
                            </a>
                        `;
                        $searchResults.append(foundProduct);
                    });
                } else {
                    $searchResults.html('<p style="padding-left: 60px; background-color: white;">' + response.message + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $searchResults.html('<p>Произошла ошибка при поиске. Попробуйте снова.</p>');
                console.log('Ошибка AJAX:', xhr, status, error);
            }
        });
    });

    $('.search input').on('input', function () {
        $('#search-results').empty();
    });
});