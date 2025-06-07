document.addEventListener('DOMContentLoaded', function () { // **1. Обертка DOMContentLoaded (начало)**
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

    document.getElementById('openFormButton').addEventListener('click', () => {
        toggleChat.click(); // имитируем клик по иконке
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

    // Функция для получения ID вошедшего пользователя из localStorage
    function getLoggedInUserId() {
        const userId = localStorage.getItem('loggedInUserId');
        console.log("getLoggedInUserId:", userId); // Для отладки
        return userId;
    }

    // Функция для отображения сообщения от бота
    function displayBotMessage(message) {
        addMessage(message, 'bot'); // Используем addMessage для отображения сообщения от бота
    }

    // Функция для отображения сообщения об ошибке
    function displayErrorMessage(message) {
        addMessage(`Ошибка: ${message}`, 'bot'); // Используем addMessage для отображения ошибки
    }

    async function botReply(userMessage) {
        const userId = getLoggedInUserId(); //  Получаем userId из localStorage
        try {
            const response = await fetch('https://tattoo-studio-bot.onrender.com/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: userMessage, userId: userId }) //  <--  Используем userId из localStorage
            });

            if (!response.ok) {
                throw new Error('Сетевая ошибка при отправке сообщения.');
            }

            const data = await response.json();
            displayBotMessage(data.response);
        } catch (error) {
            console.error('Ошибка:', error);
            displayErrorMessage('Произошла ошибка. Попробуйте еще раз.');
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

    const welcomeMessage = `👋 Приветствую! Я Чат-бот "Студии Суворова".
        Я могу помочь тебе с:
        - Регистрацией: зарегистрироваться [имя пользователя], [email,пароль,телефон]
        - Входом в систему: войти [email] [пароль]
        - Просмотром списка мастеров: мастера
        - Просмотром списка услуг: услуги
        - Записью на прием: записаться [дата] [время], [мастер,услуга]
        Чтобы начать, просто введи нужную команду!`;
    const welcomeLines = welcomeMessage.split('\n');
    welcomeLines.forEach(line => {
        addMessage(line, 'bot');
    });
}); // **1. Обертка DOMContentLoaded (конец)**

// --- Управление карточками услуг ---
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    const header = card.querySelector('.service-header');
    const content = card.querySelector('.service-content');

    // Обработчик клика по заголовку
    header.addEventListener('click', function () {
        card.classList.toggle('active');
        content.classList.toggle('active');
    });
});

// **2. Удалите `document.addEventListener('DOMContentLoaded', function() {`  и `});`  вокруг кода модального окна.**  Весь код модального окна должен быть здесь, внутри _одного_ `DOMContentLoaded`.

const mastersContainer = document.querySelector('.masters-container');
const modal = document.getElementById('worksModal');
const modalMasterName = document.getElementById('modal-master-name');
const modalWorksCarouselBody = document.getElementById('modal-works-carousel-body');
const closeBtn = document.querySelector('.close');
const carouselPrevBtn = modal.querySelector('.carousel-prev');
const carouselNextBtn = modal.querySelector('.carousel-next');
const carouselInfoCurrent = modal.querySelector('.carousel-info-current');
const carouselInfoTotal = modal.querySelector('.carousel-info-total');

let currentSlide = 0;
let slides = [];

// Функция для открытия модального окна
function openModal(masterElement) {
    console.log('openModal() вызывается'); // Проверяем, вызывается ли функция
    const masterName = masterElement.dataset.masterName;
    const worksData = JSON.parse(masterElement.dataset.works);

    console.log('masterName:', masterName); // Проверяем имя мастера
    console.log('worksData:', worksData); // Проверяем данные о работах

    if (worksData && worksData.length) {
        modalMasterName.textContent = masterName;
        modalWorksCarouselBody.innerHTML = ''; // Очищаем предыдущие слайды
        slides = []; // Очищаем массив слайдов

        worksData.forEach(work => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');

            const img = document.createElement('img');
            img.src = work;
            img.alt = `Работа мастера ${masterName}`;

            slide.appendChild(img);
            modalWorksCarouselBody.appendChild(slide);
            slides.push(slide);
        });

        currentSlide = 0;
        updateCarousel();
        updateCarouselInfo();

        // **3. Добавьте проверку на существование modal**
        if (!modal) {
            console.error("Элемент с ID 'worksModal' не найден!");
            return; // Прекращаем выполнение функции
        }

        modal.classList.add('show');
        modal.style.display = 'flex';

        // Обновляем общее количество слайдов
        carouselInfoTotal.textContent = slides.length;

    } else {
        alert("Нет доступных работ для этого мастера.");
    }
}

// Функция для закрытия модального окна
function closeModal() {
    modal.classList.remove('show');
    modal.style.display = 'none';
}

// Функция для отображения текущего слайда
function updateCarousel() {
    const translateX = -currentSlide * 100 + '%';
    modalWorksCarouselBody.style.transform = 'translateX(' + translateX + ')';
    updateCarouselInfo();
}

// Функция для обновления информации о текущем слайде
function updateCarouselInfo() {
    carouselInfoCurrent.textContent = currentSlide + 1;
}

// Обработчики событий для кнопок карусели
carouselPrevBtn.addEventListener('click', function () {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
});

carouselNextBtn.addEventListener('click', function () {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
});

// Обработчик клика для открытия модального окна
mastersContainer.addEventListener('click', function (event) {
    console.log('Клик по mastersContainer'); // Проверяем, что клик вообще регистрируется
    const button = event.target.closest('.show-works-button');
    if (button) {
        console.log('Кнопка "Посмотреть работы" найдена'); // Проверяем, что кнопка найдена
        const masterElement = button.closest('.master');
        console.log('masterElement:', masterElement); // Проверяем, что элемент мастера найден
        openModal(masterElement);
    }
});

// Обработчик клика для закрытия модального окна
closeBtn.addEventListener('click', closeModal);

// Закрытие модального окна при клике вне его
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});
