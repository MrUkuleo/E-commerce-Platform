$(document).ready(function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let total = 0;

    if (cart.length === 0) {
        $('#cart-items').html('<p>Корзина пуста</p>');
        $('#place-order').prop('disabled');
            return;
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
});