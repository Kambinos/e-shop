// document.addEventListener('DOMContentLoaded', function () {
//     const buttons = document.querySelectorAll('.config-btn');

//     buttons.forEach(button => {
//         button.addEventListener('click', function () {
//             // 1. Находим все кнопки в этом блоке и убираем активные классы
//             buttons.forEach(btn => {
//                 btn.classList.remove('bg-primary', 'text-white');
//             });

//             // 2. Добавляем активные классы нажатой кнопке
//             this.classList.add('bg-primary', 'text-white');

//             // 3. (Опционально) Здесь можно обновлять цену на странице
//             const newPrice = this.getAttribute('data-price');
//             const priceElement = document.getElementById('product-price'); // если есть ID у цены
//             if (priceElement) {
//                 priceElement.innerText = newPrice + ' ₽';
//             }
//         });
//     });

//     const minusBtn = document.querySelector('.qty-btn.minus');
//     const plusBtn = document.querySelector('.qty-btn.plus');
//     const qtyInput = document.getElementById('productQuantity');

//     minusBtn.addEventListener('click', function () {
//         let currentValue = parseInt(qtyInput.value);
//         if (currentValue > 1) {
//             qtyInput.value = currentValue - 1;
//         }
//     });

//     plusBtn.addEventListener('click', function () {
//         let currentValue = parseInt(qtyInput.value);
//         qtyInput.value = currentValue + 1;
//     });
// });

// // === CONFIGURATION SELECTOR ===
// const configButtons = document.querySelectorAll('.config-btn');
// const priceDisplay = document.querySelector('.text-2xl.font-bold.text-primary');
// const hiddenVariantInput = document.createElement('input');

// // Скрытое поле для выбранного варианта (для формы Add to Cart)
// hiddenVariantInput.type = 'hidden';
// hiddenVariantInput.name = 'variant_id';

// // Инициализация с текущим selected_variant
// const activeBtn = document.querySelector('.config-btn.bg-primary');
// hiddenVariantInput.value = activeBtn ? activeBtn.dataset.variantId : null;

// // Добавляем скрытое поле в форму
// document.querySelector('form[action*="add_to_cart"]').appendChild(hiddenVariantInput);

// // Обработчик клика по кнопке конфигурации
// configButtons.forEach(btn => {
//     btn.addEventListener('click', () => {
//         // Снимаем подсветку со всех кнопок
//         configButtons.forEach(b => b.classList.remove('bg-primary', 'text-white'));

//         // Подсвечиваем выбранную
//         btn.classList.add('bg-primary', 'text-white');

//         // Обновляем цену и скрытое поле
//         const price = parseFloat(btn.dataset.price);
//         if (priceDisplay) priceDisplay.textContent = `$${price.toFixed(2)}`;
//         hiddenVariantInput.value = btn.dataset.variantId;
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {

//     /* ================= CONFIGURATION ================= */

//     const configButtons = document.querySelectorAll('.config-btn');
//     const priceDisplay = document.querySelector('.text-2xl.font-bold.text-primary');
//     const form = document.querySelector('form[action*="add_to_cart"]');

//     // hidden input для variant_id
//     const hiddenVariantInput = document.createElement('input');
//     hiddenVariantInput.type = 'hidden';
//     hiddenVariantInput.name = 'variant_id';
//     form.appendChild(hiddenVariantInput);

//     // init selected variant
//     const activeBtn = document.querySelector('.config-btn.bg-primary');
//     if (activeBtn) {
//         hiddenVariantInput.value = activeBtn.dataset.variantId;
//     }

//     configButtons.forEach(btn => {
//         btn.addEventListener('click', () => {
//             // remove active styles
//             configButtons.forEach(b =>
//                 b.classList.remove('bg-primary', 'text-white')
//             );

//             // add active styles
//             btn.classList.add('bg-primary', 'text-white');

//             // update price
//             const price = btn.dataset.price;
//             if (priceDisplay) {
//                 priceDisplay.textContent = `$${price}`;
//             }

//             // update variant_id
//             hiddenVariantInput.value = btn.dataset.variantId;
//         });
//     });

//     /* ================= QUANTITY ================= */

//     const minusBtn = document.querySelector('.qty-btn.minus');
//     const plusBtn = document.querySelector('.qty-btn.plus');
//     const qtyInput = document.getElementById('productQuantity');

//     // hidden quantity input
//     const hiddenQtyInput = document.createElement('input');
//     hiddenQtyInput.type = 'hidden';
//     hiddenQtyInput.name = 'quantity';
//     hiddenQtyInput.value = qtyInput.value;
//     form.appendChild(hiddenQtyInput);

//     minusBtn.addEventListener('click', () => {
//         let value = parseInt(qtyInput.value);
//         if (value > 1) {
//             qtyInput.value = value - 1;
//             hiddenQtyInput.value = qtyInput.value;
//         }
//     });

//     plusBtn.addEventListener('click', () => {
//         qtyInput.value = parseInt(qtyInput.value) + 1;
//         hiddenQtyInput.value = qtyInput.value;
//     });

// });
document.addEventListener('DOMContentLoaded', function () {
    console.log("Product logic initialized...");

    // --- 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // --- 2. СЛАЙДЕР И ГАЛЕРЕЯ ---
    const wrapper = document.getElementById('sliderWrapper');
    const thumbs = document.querySelectorAll('.thumb-container');
    const nextBtn = document.getElementById('nextSlide');
    const prevBtn = document.getElementById('prevSlide');
    let currentIndex = 0;

    if (wrapper && thumbs.length > 0) {
        const totalImages = thumbs.length;

        const updateSlider = (index) => {
            currentIndex = index;
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            thumbs.forEach((t, i) => {
                t.classList.toggle('border-primary', i === currentIndex);
                t.classList.toggle('border-transparent', i !== currentIndex);
            });
        };

        window.currentSlide = updateSlider; // Оставляем для onclick в HTML

        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlider((currentIndex + 1) % totalImages);
        });

        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlider((currentIndex - 1 + totalImages) % totalImages);
        });
    }


    // --- 4. УПРАВЛЕНИЕ КОЛИЧЕСТВОМ ---
    const btnMinus = document.querySelector('.qty-btn.minus');
    const btnPlus = document.querySelector('.qty-btn.plus');
    const qtyInput = document.getElementById('productQuantity');
    const hiddenQty = document.getElementById('hiddenQuantity');

    if (qtyInput) {
        btnPlus?.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
            if (hiddenQty) hiddenQty.value = qtyInput.value;
        });
        btnMinus?.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
                if (hiddenQty) hiddenQty.value = qtyInput.value;
            }
        });
    }

    // --- 5. ДОБАВЛЕНИЕ В КОРЗИНУ (AJAX) ---
    const cartForm = document.querySelector('form[action*="add_to_cart"]');
    const cartCount = document.querySelector('.mobile-bottom-nav .count');

    cartForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const vId = variantInput?.value;
        const qty = qtyInput?.value || 1;

        if (!vId) {
            alert('Пожалуйста, выберите комплектацию');
            return;
        }

        fetch(this.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `quantity=${qty}&variant_id=${vId}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (cartCount) {
                    const current = parseInt(cartCount.textContent) || 0;
                    cartCount.textContent = current + parseInt(qty);
                }
                alert('Товар добавлен в корзину!');
            }
        })
        .catch(err => console.error("Ошибка корзины:", err));
    });
});