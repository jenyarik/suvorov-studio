$(document).ready(function () {
    const toggleChat = document.querySelector('.chatbot-toggle');
    const chatWindow = document.querySelector('.chatbot-window');
    const closeChat = document.querySelector('.chatbot-close');
    const inputField = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatbotMessages');

    // Открытие/закрытие окна
    toggleChat.addEventListener('click', () => {
        chatWindow.classList.add('active');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Обработка отправки сообщения
    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = 'message ' + sender;
        msg.textContent = text;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function botReply(userMessage) {
        setTimeout(() => {
            addMessage("Пример ответа бота.", "bot");
        }, 500);
    }

    document.querySelector('.chatbot-send').addEventListener('click', () => {
        const message = inputField.value.trim();
        if (message !== '') {
            addMessage(message, 'user');
            inputField.value = '';
            botReply(message);
        }
    });

    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.querySelector('.chatbot-send').click();
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
