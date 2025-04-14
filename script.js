$(document).ready(function() {
    const CategoryName = $('.categories > h2');

    function fetchProductInfo(productName, element) {
        $.ajax({
            url: "products/get_product_info.php",
            type: "GET",
            data: { product_name: productName },
            dataType: "json",
            success: function(response) {
                if (response.error) {
                    $(element).find('.how-much-is-left').text("Нет данных");
                } else {
                    $(element).find('.how-much-is-left').text("В наличии: " + response.quantity + " шт.");
                    $(element).find('.product-price').text(response.price + " ₽"); // ← ВСТАВЬ СЮДА
                }
            },
            error: function() {
                $(element).find('.how-much-is-left').text("Ошибка запроса к серверу");
            }
        });
    }
    

    // Обработка каждой карточки
    $('.card').each(function() {
        let productName = $(this).find('.card-name').text().trim();
        const card = $(this);
        const title = card.find('h3').text().trim();
        const imagePath = 'products/pictures/' + title + '.jpg';

        // Создаем тег <img> и добавляем его в карточку
        const img = $('<img>', {
            src: imagePath,
            alt: title,
            class: 'card-img-top',
            error: function () {
                $(this).replaceWith('<div class="text-danger text-center mt-3">Изображение не найдено</div>');
            }
        });

        // Вставляем изображение в начало карточки, если его ещё нет
        if (card.find('img').length === 0) {
            card.prepend(img);
        }

        fetchProductInfo(productName, this);
    });

    $(".card-name").each(function () {
        const card = $(this).closest('.card'); 
        const title = $(this).text().trim(); 
        const imagePath = `products/pictures/${title}.jpg`;
    
        if (title.length > 35) {
            let shortened = title.slice(0, 30) + '...';
            $(this).text(shortened);
        }
    
        const img = $('<img>', {
            src: imagePath,
            alt: title,
            class: 'card-img-top',
            error: function () {
                $(this).replaceWith('<div class="text-danger text-center mt-3">Изображение не найдено</div>');
            }
        });

        if (card.find('img').length === 0) {
            card.prepend(img);
        }

        console.log(imagePath);
    });
    
    $('.card').hover(
        function() { 
            $(this).find('h3').css('color', 'blue');
            $(this).find('h3').animate({ marginTop: "-5px" }, 200);
            $(this).find('img').css('width', '95%');
            $(this).find('img').css('height', '62%');
        },
        
        function() {
            $(this).find('h3').css('color', 'black');
            $(this).find('h3').animate({ marginTop: "0" }, 200);
            $(this).find('img').css('width', '90%', 200);
            $(this).find('img').css('height', '57%', 200);
        }
    );

    $('.categories .cards').hide();

    // Навешиваем обработчик на все заголовки категорий
    $('.categories > h2').click(function () {
        const currentCards = $(this).next('.cards');

        // Закрываем все кроме текущего
        $('.categories .cards').not(currentCards).slideUp(200);

        // Переключаем текущий
        currentCards.slideToggle(200);
    });
});