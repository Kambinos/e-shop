   // Ждем полной загрузки страницы
    document.addEventListener("DOMContentLoaded", function() {
        // Находим все сообщения
        const alerts = document.querySelectorAll('.alert');

        if (alerts.length > 0) {
            // Устанавливаем таймер на 5 секунд (5000 мс)
            setTimeout(function() {
                alerts.forEach(function(alert) {
                    // Сначала делаем прозрачным (для красивого эффекта)
                    alert.style.opacity = '0';
                    
                    // Через полсекунды удаляем из DOM полностью
                    setTimeout(function() {
                        alert.style.display = 'none';
                    }, 500); 
                });
            }, 5000); 
        }
    });