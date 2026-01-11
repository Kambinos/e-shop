const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

// Функция обновления UI кнопки
function updateThemeUI(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
        themeText.innerText = '';
    } else {
        body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
        themeText.innerText = '';
    }
}

// 1. Проверка при загрузке
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    updateThemeUI(true);
}

// 2. Обработчик клика
themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
});

// Дублируем для мобильной кнопки, если она есть
const mobileBtn = document.getElementById('mobileThemeToggle');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => themeToggle.click());
}

function initPriceSync() {
    const slider = document.getElementById('priceSlider');
    const maxInput = document.getElementById('maxPrice');
    if (slider && maxInput) {
        slider.addEventListener('input', (e) => {
            maxInput.value = e.target.value;
        });
    }
}
///////////////////////////////////////////////////
//////////////////////////////////////////////////

const formatPrice = (number) => {
    // Используем en-US, чтобы разделителем была точка, а не запятая
    // useGrouping: false уберет пробел в тысячах (будет 6000, а не 6 000)
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false 
    }).format(number) + '$';
};

function checkEmpty() {
    if (!document.querySelector('.cart-item')) {
        const cartContent = document.getElementById('cartContent');
        const emptyCart = document.getElementById('emptyCart');
        if (cartContent) cartContent.classList.add('hidden');
        if (emptyCart) emptyCart.classList.remove('hidden');
    }
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.qty-btn, .delete-btn');
    if (!btn) return;

    // Предотвращаем стандартное поведение (на случай если это кнопки в форме)
    e.preventDefault();

    const cartItem = btn.closest('.cart-item');
    const itemId = cartItem.dataset.itemId;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    let action = '';
    if (btn.classList.contains('plus')) action = 'plus';
    else if (btn.classList.contains('minus')) action = 'minus';
    else if (btn.classList.contains('delete-btn')) action = 'delete';

    // Опционально: можно добавить класс 'loading' на время запроса
    btn.style.pointerEvents = 'none'; 

    fetch('/update-cart-quantity/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ item_id: itemId, action })
    })
    .then(res => res.json())
    .then(data => {
        btn.style.pointerEvents = 'auto'; // Возвращаем кликабельность

        if (!data.success) {
            console.error('Server error:', data.error);
            return;
        }

        if (data.quantity <= 0 || action === 'delete') {
            cartItem.classList.add('removing');
            setTimeout(() => {
                cartItem.remove();
                checkEmpty();
            }, 300);
        } else {
            // Обновляем количество в инпуте
            const input = cartItem.querySelector('.qty-input');
            if (input) input.value = data.quantity;
            
            // Обновляем цену товара
            const itemTotal = cartItem.querySelector('.item-total-price');
            if (itemTotal) itemTotal.innerText = formatPrice(data.item_total);
        }

        // Обновляем общую сумму (везде, где есть этот класс)
        document.querySelectorAll('.cart-total-price').forEach(el => {
            el.innerText = formatPrice(data.cart_total);
        });

        // Обновляем счетчик товаров в корзине (например, в шапке)
        const countEl = document.getElementById('cartCount');
        if (countEl) countEl.innerText = data.cart_items_count;
    })
    .catch(err => {
        btn.style.pointerEvents = 'auto';
        console.error('Fetch error:', err);
    });
});

// document.addEventListener('click', function (e) {
//     const btn = e.target.closest('.qty-btn, .delete-btn');
//     if (!btn) return;

//     const cartItem = btn.closest('.cart-item');
//     const itemId = cartItem.dataset.itemId;
//     const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

//     let action = '';
//     if (btn.classList.contains('plus')) action = 'plus';
//     else if (btn.classList.contains('minus')) action = 'minus';
//     else if (btn.classList.contains('delete-btn')) action = 'delete';

//     fetch('/update-cart-quantity/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrftoken
//         },
//         body: JSON.stringify({ item_id: itemId, action })
//     })
//         .then(res => res.json())
//         .then(data => {
//             if (!data.success) return;

//             if (data.quantity <= 0 || action === 'delete') {
//                 cartItem.classList.add('removing');
//                 setTimeout(() => {
//                     cartItem.remove();
//                     checkEmpty();
//                 }, 300);
//             } else {
//                 cartItem.querySelector('.qty-input').value = data.quantity;
//                 cartItem.querySelector('.item-total-price').innerText =
//                     formatPrice(data.item_total);
//             }

//             document.querySelectorAll('.cart-total-price').forEach(el => {
//                 el.innerText = formatPrice(data.cart_total);
//             });

//             const countEl = document.getElementById('cartCount');
//             if (countEl) countEl.innerText = data.cart_items_count;
//         });
//     const formatPrice = (number) => {
//         return new Intl.NumberFormat('ru-RU', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         }).format(number) + '$';
//         // Если знак доллара нужен впереди, сделай: '$ ' + ...
//     };
// });

// function checkEmpty() {
//     if (!document.querySelector('.cart-item')) {
//         document.getElementById('cartContent').classList.add('hidden');
//         document.getElementById('emptyCart').classList.remove('hidden');
//     }
// }
