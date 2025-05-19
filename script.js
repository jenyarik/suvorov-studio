document.addEventListener('DOMContentLoaded', function() {
    //  Функциональность для Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const header = card.querySelector('.service-header');
        const content = card.querySelector('.service-content');

        header.addEventListener('click', function() {
            card.classList.toggle('active');
            content.classList.toggle('active');
        });
    });

    //  Функциональность для модального окна с работами мастеров
    const mastersContainer = document.querySelector('.masters-container');
    if (mastersContainer) {
        const modal = document.getElementById('worksModal');
        const modalMasterName = document.getElementById('modal-master-name');
        const modalWorksGrid = document.getElementById('modal-works-grid');
        const closeBtn = document.querySelector('.close');

        function openModal(masterElement) {
            const masterName = masterElement.dataset.masterName;
            const worksData = JSON.parse(masterElement.dataset.works);

            modalMasterName.textContent = masterName;
            modalWorksGrid.innerHTML = '';

            worksData.forEach(work => {
                const img = document.createElement('img');
                img.src = work;
                img.alt = `Работа мастера ${masterName}`;
                modalWorksGrid.appendChild(img);
            });

            modal.classList.add('show');
        }

        function closeModal() {
            modal.classList.remove('show');
        }

        mastersContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.show-works-button');
            if (button) {
                const masterElement = button.closest('.master');
                openModal(masterElement);
            }
        });

        closeBtn.addEventListener('click', closeModal);

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                closeModal();
            }
        });
    }

    //  Функциональность для контейнера чата
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const toggleAdminPanelButton = document.getElementById('toggleAdminPanelButton');
    const adminPanelContainer = document.getElementById('adminPanelContainer');
    const messagesTableBody = document.getElementById('messagesTableBody');
    const passwordModal = document.getElementById('passwordModal');
    const overlay = document.getElementById('overlay');
    const confirmPasswordButton = document.getElementById('confirmPasswordButton');
    const adminPasswordInput = document.getElementById('adminPassword');

    const adminPassword = 'admin'; // Замените на ваш пароль
    let isAdminPanelVisible = false;

    //  Функция для отображения сообщения в чате
    function displayMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(type); // 'user-message' или 'bot-message'
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);

        //  Автопрокрутка контейнера чата
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    //  Функция для отображения модального окна
    function showModal() {
        passwordModal.style.display = 'block';
        overlay.style.display = 'block';
    }

    //  Функция для скрытия модального окна
    function hideModal() {
        passwordModal.style.display = 'none';
        overlay.style.display = 'none';
    }

    //  Обработчик для кнопки "Подтвердить" в модальном окне
    confirmPasswordButton.addEventListener('click', function() {
        const enteredPassword = adminPasswordInput.value;

        if (enteredPassword === adminPassword) {
            //  Если пароль верен, показываем панель администратора
            adminPanelContainer.classList.remove('hidden');
            isAdminPanelVisible = true;
            getMessages(); //  Загружаем сообщения
            hideModal(); //  Скрываем модальное окно
        } else {
            //  Если пароль неверен, выводим сообщение об ошибке
            alert('Неверный пароль.');
            adminPasswordInput.value = ''; //  Очищаем поле ввода пароля
        }
    });

    //  Обработчик для кнопки "Показать Панель администратора"
    toggleAdminPanelButton.addEventListener('click', function() {
        //  Если панель администратора уже видна, просто скрываем её
        if (isAdminPanelVisible) {
            adminPanelContainer.classList.add('hidden');
            isAdminPanelVisible = false;
        } else {
            //  Если панель администратора скрыта, показываем модальное окно
            showModal();
        }
    });

    //  Функция для получения сообщений
    async function getMessages() {
        try {
            const response = await fetch('/get-bot-messages');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const messages = await response.json();
            displayMessages(messages);
        } catch (error) {
            console.error('Ошибка при получении сообщений:', error);
            messagesTableBody.innerHTML = '<tr><td colspan="5">Ошибка при загрузке сообщений.</td></tr>';
        }
    }

    //  Функция для отображения сообщений
    function displayMessages(messages) {
        messagesTableBody.innerHTML = ''; //  Очищаем таблицу

        messages.forEach(message => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${message.id}</td>
                <td>${message.user_id}</td>
                <td>${message.chat_id}</td>
                <td>${message.message_text}</td>
                <td>${new Date(message.message_date).toLocaleString()}</td>
            `;
            messagesTableBody.appendChild(row);
        });
    }

    //  Обработчик для отправки сообщений в чат
    sendButton.addEventListener('click', async function() {
        const messageText = chatInput.value;
        if (messageText.trim() !== '') {
            //  Отображаем сообщение пользователя в чате
            displayMessage(messageText, 'user-message');

            //  Отправляем сообщение на сервер (в bot.js) и получаем ответ
            try {
                const response = await fetch('/bot', { // Путь к вашему webhook-endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: {
                            text: messageText // Отправляем текст сообщения
                        }
                    })
                });

                if (response.ok) {
                    // Получаем ответ от сервера (если есть)
                    const data = await response.json();
                    const botResponse = data.response; // Предполагаем, что ответ бота приходит в поле "response"
                    // Отображаем ответ бота в чате
                    displayMessage(botResponse, 'bot-message');
                } else {
                    console.error('Ошибка при отправке сообщения на сервер:', response.status);
                    displayMessage('Ошибка при отправке сообщения.', 'bot-message');
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
                displayMessage('Ошибка при отправке сообщения.', 'bot-message');
            }

            chatInput.value = ''; //  Очищаем поле ввода
        }
    });
});
