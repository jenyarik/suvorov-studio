$(document).ready(function () {
    // Обработчик скролла
    $(document).scroll(function () {
        var scroll = $(this).scrollTop();
        if (scroll >= 150) {
            $("#popUp").css("margin-left", "-425px");
            $("#plus").css("margin-left", "0px");
        }
    });

    // Обработчик открытия окна
    $("#plus").click(function () {
        $("#popUp").css("margin-left", "0px");
        $("#darkBack").fadeIn(); // Показываем затемненный фон
    });

    // Обработчик закрытия окна
    document.getElementById('close').addEventListener('click', function () {
        document.getElementById('popUp').style.display = 'none';
        document.getElementById('darkBack').style.display = 'none'; // Скрываем фон
    });

    // === Чат с ботом ===
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    // ID пользователя (можно сделать уникальным)
    const userId = 'web_user_' + Math.random().toString(36).substr(2, 9);

    // Функция для отображения сообщений в чате
    function displayMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Отправка сообщения при нажатии кнопки или Enter
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        displayMessage(messageText, 'user-message');
        chatInput.value = '';

        try {
            const response = await fetch('https://tattoo-studio-bot.onrender.com/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: messageText,
                    userId: userId
                })
            });

            const data = await response.json();

            if (data && data.response) {
                displayMessage(data.response, 'bot-message');
            } else {
                displayMessage('Не удалось получить ответ.', 'bot-message');
            }
        }('Ошибка отправки);
            displayMessage('Ошибка соединения с ботом.', 'bot-message');
        }
    }
});

    // --- Управление карточками услуг ---
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const header = card.querySelector('.service-header');
        const content = card.querySelector('.service-content');

        // Обработчик клика по заголовку
        header.addEventListener('click', function() {
            card.classList.toggle('active');
            content.classList.toggle('active');
        });
    });

  const mastersContainer = document.querySelector('.masters-container');
    if (mastersContainer) {
        const modal = document.getElementById('worksModal');
        const modalMasterName = document.getElementById('modal-master-name');
        const modalWorksGrid = document.getElementById('modal-works-grid');
        const closeBtn = document.querySelector('.close');
        // Функция для открытия модального окна
        
       document.getElementById('worksModal').style.zIndex = '100'; // Устанавливаем z-индекс модального окна

        function openModal(masterElement) {
            const masterName = masterElement.dataset.masterName;
            const worksData = JSON.parse(masterElement.dataset.works);

            modalMasterName.textContent = masterName;
            modalWorksGrid.innerHTML = ''; // Очищаем предыдущие работы

            worksData.forEach(work => {
                const img = document.createElement('img');
                img.src = work;
                img.alt = `Работа мастера ${masterName}`;
                modalWorksGrid.appendChild(img);
            });
            modal.classList.add('show');
        }
        // Функция для закрытия модального окна
        function closeModal() {
            modal.classList.remove('show');
        }
        // Обработчик клика для открытия модального окна
        mastersContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.show-works-button');
            if (button) {
                const masterElement = button.closest('.master');
                openModal(masterElement);
            }
        });
        // Обработчик клика для закрытия модального окна
        closeBtn.addEventListener('click', closeModal);
        // Закрытие модального окна при клике вне его
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                closeModal();
            }
        });
    }
});
