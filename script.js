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
const welcomeMessage = `👋 Приветствую! Я Чат-бот "Студии Суворова".<br>
Я могу помочь тебе с:<br>
- Регистрацией:   зарегистрироваться [имя пользователя] [email] [пароль] [телефон]<br>
- Входом в систему: войти [email] [пароль]<br>
- Просмотром списка мастеров: мастера<br>
- Просмотром списка услуг: услуги<br>
- Записью на прием: записаться [дата] [время] [мастер] [услуга]<br>
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

document.addEventListener('DOMContentLoaded', function() {
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
        const masterName = masterElement.dataset.masterName;
        const worksData = JSON.parse(masterElement.dataset.works);

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
    carouselPrevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    carouselNextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    });

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
});

