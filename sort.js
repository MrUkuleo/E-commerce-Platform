$(document).ready(function () {
    const catalog = $('#catalog');

    function parsePrice(text) {
        return parseFloat(text.replace(/[^\d.]/g, '')) || 0;
    }
    
    function parseQuantity(text) {
        const num = parseInt(text.replace(/[^\d]/g, ''));
        return isNaN(num) ? 0 : num;
    }
    
    function sortCards() {
        const sortBy = $('#sort-by').val();
        const direction = $('#sort-direction').val();
        const cards = $('#catalog').children('.card').get();
    
        if (sortBy === 'default') {
            cards.sort((a, b) => $(a).index() - $(b).index());
        } else {
            cards.sort((a, b) => {
                const aVal = sortBy === 'price'
                    ? parsePrice($(a).find('.product-price').text())
                    : parseQuantity($(a).find('.how-much-is-left').text());
    
                const bVal = sortBy === 'price'
                    ? parsePrice($(b).find('.product-price').text())
                    : parseQuantity($(b).find('.how-much-is-left').text());
    
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            });
        }
    
        $('#catalog').append(cards); // Переотрисовка
    }
    
    $('#sort-by, #sort-direction').on('change', sortCards);    
});
