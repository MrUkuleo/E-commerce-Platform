$(document).ready(function () {
    let productName = $("#product-name").text().trim();

    // Запрос данных о товаре
    $.ajax({
        url: "get_product_info.php",
        type: "GET",
        data: { product_name: productName },
        dataType: "json",
        success: function (response) {
            if (response.error) {
                $("#description").text(response.error);
                $("#price").text("");
                $("#how-much-is-left").text("");
            } else {
                $("#description").text(response.description);
                $("#price").text(response.price + " ₽");

                if (response.quantity <= 0)
                {
                    $("#how-much-is-left").text("Нет в наличии!");
                    $("#how-much-is-left").css('color', 'red');

                    $('#add-to-cart').prop('disabled', true);
                }
                else
                {
                    $("#how-much-is-left").text("В наличии: " + response.quantity + " шт.");
                    $("#how-much-is-left").css('color', 'black');
                }
                HowMuchIsLeft = response.quantity;
                $('#how-much-is-left').html(`В наличии: ${HowMuchIsLeft} шт.`);
                updateButtons();
                checkCartState(); 
            }
        },
        error: function () {
            $("#description").text("Ошибка запроса к серверу.");
            $("#price").text("");
            $("#how-much-is-left").text("");
        }
    });

    const imagePath = `pictures/${productName}.jpg`;
    $.ajax({
        url: imagePath,
        type: 'HEAD',
        success: function () {
            $("#displayed-image").attr("src", imagePath);
        },
        error: function () {
            $("#displayed-image").attr("alt", "Изображение не найдено");
            console.log(imagePath);
        }
    });

    $(".mini-pics img").click(function () {
        $("#displayed-image").attr("src", $(this).attr("src"));
    });

    $('.in-the-cart').hide();
    $('#goto-cart').hide();

    let HowMuchIsLeft = 10;
    let HowMuchIsAdded = 1;

    $('.in-the-cart input').val(HowMuchIsAdded);

    // Проверка: есть ли товар уже в корзине
    function checkCartState() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(p => p.name === productName);
        if (existingProduct) {
            HowMuchIsAdded = existingProduct.quantity;
            $('.in-the-cart').show();
            $('#goto-cart').show();
            $('#add-to-cart').hide();
            $('.in-the-cart input').val(HowMuchIsAdded);
            updateButtons();
        }
    }

    $('#add-to-cart').click(function () {
        $(this).hide();
        $('.in-the-cart').show();
        $('#goto-cart').show();
        HowMuchIsAdded = 1;
        $('.in-the-cart input').val(HowMuchIsAdded);
        updateButtons();
    });

    $('#confirm-add').click(function () {
        const priceText = $('#price').text().trim();
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        const quantity = HowMuchIsAdded;

        if (!productName || isNaN(price)) {
            alert('Ошибка: не удалось определить товар или цену.');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(p => p.name === productName);
        if (existingProduct) {
            existingProduct.quantity = quantity;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Товар "${productName}" (${quantity} шт.) добавлен в корзину!`);
        updateButtons();
    });

    $('#plus').click(function () {
        let currentValue = parseInt($('.in-the-cart input').val());
        if (currentValue < HowMuchIsLeft) {
            currentValue++;
            $('.in-the-cart input').val(currentValue);
            HowMuchIsAdded = currentValue;
        }
        updateButtons();
    });

    $('#minus').click(function () {
        let currentValue = parseInt($('.in-the-cart input').val());
        if (currentValue > 1) {
            currentValue--;
            $('.in-the-cart input').val(currentValue);
            HowMuchIsAdded = currentValue;
        } else {
            $('.in-the-cart').hide();
            $('#goto-cart').hide();
            $('#add-to-cart').show();
            HowMuchIsAdded = 1;

            // Удалим товар из localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(p => p.name !== productName);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        updateButtons();
    });

    function updateButtons() {
        let currentValue = parseInt($('.in-the-cart input').val());
        $('#plus').prop('disabled', currentValue >= HowMuchIsLeft);
    }

    updateButtons();
});