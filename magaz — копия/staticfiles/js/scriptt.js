// document.addEventListener('DOMContentLoaded', function () {
//     initTheme();
//     initPriceSync();
// });

// let manufacturersList = document.querySelector(".manufacturers__list");

// document.addEventListener('DOMContentLoaded', function () {
//     initTheme();
//     // initPriceSync(); // Убедитесь, что эта функция определена
// });

// function initTheme() {
//     // 1. Ищем обе кнопки по их ID
//     const themeButtons = document.querySelectorAll('themeToggle, mobileThemeToggle');
//     const html = document.documentElement;
//     const body = document.body;

//     const updateUI = (isDark) => {
//         if (isDark) {
//             html.classList.add('dark');
//             body.classList.add('dark-mode');
//         } else {
//             html.classList.remove('dark');
//             body.classList.remove('dark-mode');
//         }

//         // Обновляем иконки на всех кнопках
//         themeButtons.forEach(btn => {
//             const icon = btn.querySelector('i');
//             if (icon) {
//                 // Если используете Font Awesome (как в вашем коде):
//                 icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
//             }
//         });
//     };

//     // Проверка сохраненной темы
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     const isInitialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

//     updateUI(isInitialDark);

//     // Вешаем клик на ВСЕ найденные кнопки
//     themeButtons.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault(); // На всякий случай
//             const currentDark = html.classList.contains('dark');
//             const newDarkState = !currentDark;
            
//             localStorage.setItem('theme', newDarkState ? 'dark' : 'light');
//             updateUI(newDarkState);
//         });
//     });
// }

// function initTheme() {
//     // Используем querySelectorAll, чтобы найти кнопки и в шапке, и в мобильном меню
//     // Рекомендую добавить класс .theme-toggle-btn всем кнопкам переключения темы
//     const themeButtons = document.querySelectorAll('#themeToggle, .mobile-theme-toggle');
//     const body = document.body;

//     // Функция для обновления иконок на всех кнопках сразу
//     const updateIcons = (isDark) => {
//         themeButtons.forEach(btn => {
//             btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

//             // Добавляем микро-анимацию при переключении
//             btn.classList.add('theme-animate');
//             setTimeout(() => btn.classList.remove('theme-animate'), 300);
//         });
//     };

//     // 1. Проверка сохраненной темы
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//         body.classList.add('dark-mode');
//         updateIcons(true);
//     }

//     // 2. Логика клика (работает для всех найденных кнопок)
//     themeButtons.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault();
//             const isDark = body.classList.toggle('dark-mode');
//             localStorage.setItem('theme', isDark ? 'dark' : 'light');
//             updateIcons(isDark);
//         });
//     });
// }

function initPriceSync() {
    const slider = document.getElementById('priceSlider');
    const maxInput = document.getElementById('maxPrice');
    if (slider && maxInput) {
        slider.addEventListener('input', (e) => {
            maxInput.value = e.target.value;
        });
    }
}

// ===== SIDEBAR TOGGLE =====
function initSidebarToggle() {
    const filterToggle = document.getElementById('filterToggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.getElementById('sidebarClose');

    if (!filterToggle || !sidebar) return;

    filterToggle.addEventListener('click', function () {
        sidebar.classList.toggle('show');
    });

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            sidebar.classList.remove('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(event.target) && !filterToggle.contains(event.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}




