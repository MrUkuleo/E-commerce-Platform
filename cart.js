$(document).ready(function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let total = 0;

    if (cart.length === 0) {
        $('#cart-items').html('<p>Корзина пуста</p>');
        $('#place-order').prop('disabled', true);
        $('#place-order').addClass('disabled');
        return;
    }
    else{
        $('#place-order').prop('disabled', false);
        $('#place-order').removeClass('disabled');
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
       
        const card = `
        <div class="card">
        <img src="products/pictures/${item.name}.jpg" alt="${item.name}" class="card-img">
        <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-text">Цена: ${item.price} ₽</p>
        <p class="card-text">Количество: ${item.quantity}</p>
        <p class="card-text">Сумма: ${subtotal} ₽</p>
        </div>
        </div>
        `;
        $('#cart-items').append(card);
        
        console.log(item.name);
    });

    $('#total-price').text(`Общая сумма: ${total} ₽`);

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        let total = 0;
        $('#cart-items').empty();

        if (cart.length === 0) {
            $('#cart-items').html('<p>Корзина пуста</p>');
            $('#total-price').text('');
            return;
        }

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            let displayedName = item.name.length > 35 ? item.name.slice(0, 30) + '...' : item.name;

            total += subtotal;

            const card = `
                <div class="card" data-index="${index}">
                    <img src="products/pictures/${item.name}.jpg" alt="${item.name}" class="card-img">
                    <div class="card-body">
                        <h3 class="card-title">${displayedName}</h3>
                        <p class="card-text">Цена: ${item.price} ₽</p>
                        <p class="card-text">Количество: ${item.quantity}</p>
                        <p class="card-text">Сумма: ${subtotal} ₽</p>
                        <button class="remove-btn">Удалить</button>
                    </div>
                </div>
            `;
            $('#cart-items').append(card);
        });

        $('#total-price').text(`Общая сумма: ${total} ₽`);
    }

    $('#cart-items').on('click', '.remove-btn', function () {
        const index = $(this).closest('.card').data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const res = confirm(`Вы уверены, что хотите удалить следующий товар:\n${$(this).closest('.card').find('h3').text()}?`)

        if(res )
        {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });

    renderCart();

    $('#place-order').click(function () {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
        if (cart.length === 0) return;
    
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
    
        $('#order-total').text(`Итого: ${total} ₽`);
        $('#order-form').slideDown(300);
    });

    $('#confirm-order-btn').click(function () {
        const name = $('#customer-name').val().trim();
        const contact = $('#customer-contact').val().trim();
        const address = $('#customer-address').val().trim();
    
        if (!name || !contact || !address) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return;
        }
    
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderData = {
            customer: {
                name: name,
                contact: contact,
                address: address,
                comment: $('#customer-comment').val().trim()
            },
            items: cart,
            date: new Date().toISOString()
        };
    
        // TODO: Отправка на сервер через fetch/ajax
        console.log("Order confirmed:", orderData);
    
        // Очистить корзину
        localStorage.removeItem('cart');
        renderCart();
        $('#order-form').slideUp(300);
        alert("Спасибо за заказ! Мы свяжемся с вами в ближайшее время.");

        $('#place-order').prop('disabled', true);
        $('#place-order').addClass('disabled');
    });
    
    
});