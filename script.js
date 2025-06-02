$(document).ready(function () {
    const toggleChat = document.querySelector('.chatbot-toggle');
    const chatWindow = document.querySelector('.chatbot-window');
    const closeChat = document.querySelector('.chatbot-close');
    const inputField = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatbotMessages');
    const sendButton = document.querySelector('.chatbot-send');

    // Открытие/закрытие окна
    toggleChat.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });
    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = 'message ' + sender;
        msg.textContent = text;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function botReply(userMessage) {
        try {
            const response = await fetch('https://tattoo-studio-bot.onrender.com/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: userMessage, userId: 1 })
            });

            if (!response.ok) {
                throw new Error('Сетевая ошибка при отправке сообщения.');
            }

            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Ошибка:', error);
            addMessage('Произошла ошибка. Попробуйте еще раз.', 'bot');
        }
    }

    const sendMessage = () => {
        const message = inputField.value.trim();
        if (message) {
            addMessage(message, 'user');
            inputField.value = '';
            botReply(message);
        } else {
            alert("Пожалуйста, введите сообщение.");
        }
    };

    sendButton.addEventListener('click', sendMessage);

    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Приветственное сообщение
    const welcomeMessage = `👋 Приветствую! Я Чат-бот "Студия Суворова".
        Я могу помочь тебе с:
        - Регистрацией:  /register username email password phone
        - Входом в систему: /login email password
        - Просмотром списка мастеров: мастера
        - Просмотром списка услуг: услуги
        - Записью на прием: записаться [дата] [время] [мастер] [услуга]

        Чтобы начать, просто введи нужную команду!`;

    addMessage(welcomeMessage, 'bot');
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
        function openModal(masterElement) {
            const masterName = masterElement.dataset.masterName;
            const worksData = JSON.parse(masterElement.dataset.works); // Валидация данных

            if (worksData && worksData.length) { // Проверка на наличие работ
                modalMasterName.textContent = masterName;
                modalWorksGrid.innerHTML = ''; // Очищаем предыдущие работы

                worksData.forEach(work => {
                    const img = document.createElement('img');
                    img.src = work;
                    img.alt = `Работа мастера ${masterName}`;
                    modalWorksGrid.appendChild(img);
                });
                modal.classList.add('show');
                modal.style.display = 'flex'; // Показываем модальное окно как флекс
            } else {
                alert("Нет доступных работ для этого мастера."); // Сообщение, если работ нет
            }
        }

        // Функция для закрытия модального окна
        function closeModal() {
            modal.classList.remove('show');
            modal.style.display = 'none'; // Скрываем модальное окно
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
            if (event.target === modal) {
                closeModal();
            }
        });
    }

