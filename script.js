$(document).ready(function() {
    //  Обработчик скролла
    $(document).scroll(function() {
        var scroll = $(this).scrollTop();
        if (scroll >= 150) {
            $("#popUp").css("margin-left", "-425px");
            $("#plus").css("margin-left", "0px");
        }
    });
document.getElementById('openFormButton').addEventListener('click', function() {
  document.getElementById('popUp').style.display = 'block';
});

    //  Обработчик открытия окна
    $("#plus").click(function() {
        $("#popUp").css("margin-left", "0px");
        $("#darkBack").fadeIn(); // Показываем затемненный фон
    });

    //  Обработчик закрытия окна
document.getElementById('close').addEventListener('click', function() {
    document.getElementById('popUp').style.display = 'none';
    document.getElementById('darkBack').style.display = 'none'; // Скрываем затемнённый фон
});

    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    // Функция для отображения сообщения в чате
    function displayMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(type); // 'user-message' или 'bot-message'
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);

        // Автопрокрутка контейнера чата
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Обработчик для отправки сообщений в чат
    sendButton.addEventListener('click', async function() {
        const messageText = chatInput.value;
        if (messageText.trim() !== '') {
            // Отображаем сообщение пользователя в чате
            displayMessage(messageText, 'user-message');

            // Отправляем сообщение на сервер (в bot.js) и получаем ответ
            try {
                const response = await fetch('http://localhost:3000/bot', { // Замените на URL вашего API
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: {
                            text: messageText
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

            chatInput.value = ''; // Очищаем поле ввода
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
