document.addEventListener('DOMContentLoaded', function() {
    // === Чат-бот ===
    const toggleChat = document.querySelector('.chatbot-toggle');
    const chatWindow = document.querySelector('.chatbot-window');
    const closeChat = document.querySelector('.chatbot-close');
    const inputField = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatbotMessages');
    const sendButton = document.querySelector('.chatbot-send');

    if (toggleChat && chatWindow && closeChat && inputField && messagesContainer && sendButton) {
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
        const welcomeMessage = `👋 Приветствую! Я Чат-бот "Студии Суворова".
            Я могу помочь тебе с:
            - Регистрацией:  зарегистрироваться [имя пользователя] [email] [пароль] [телефон]
            - Входом в систему: войти [email] [пароль]
            - Просмотром списка мастеров: мастера
            - Просмотром списка услуг: услуги
            - Записью на прием: записаться [дата] [время] [мастер] [услуга]
            Чтобы начать, просто введи нужную команду!`;

        addMessage(welcomeMessage, 'bot');
    } else {
        console.error('Не удалось загрузить элементы чат-бота');
    }

    // === Управление карточками услуг ===
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const header = card.querySelector('.service-header');
        const content = card.querySelector('.service-content');

        if (header && content) {
            // Обработчик клика по заголовку
            header.addEventListener('click', function() {
                card.classList.toggle('active');
                content.classList.toggle('active');
            });
        } else {
            console.error('Не удалось загрузить элементы карточки услуг');
        }
    });

    // === Модальное окно с работами мастеров ===
    const mastersContainer = document.querySelector('.masters-container');
    const modal = document.getElementById('worksModal');
    const modalMasterName = document.getElementById('modal-master-name');
    const modalWorksCarouselBody = document.getElementById('modal-works-carousel-body');
    const closeBtn = document.querySelector('.close');
    const carouselPrevBtn = modal?.querySelector('.carousel-prev'); // Optional chaining
    const carouselNextBtn = modal?.querySelector('.carousel-next'); // Optional chaining
    const carouselInfoCurrent = modal?.querySelector('.carousel-info-current'); // Optional chaining
    const carouselInfoTotal = modal?.querySelector('.carousel-info-total'); // Optional chaining

    let currentSlide = 0;
    let slides = [];

    // Функция для открытия модального окна
    function openModal(masterElement) {
        if (!masterElement) {
            console.error('Не удалось загрузить элемент мастера');
            return;
        }

        if (!modal) {
            console.error('Не удалось загрузить модальное окно');
            return;
        }

        const masterName = masterElement.dataset.masterName;
        let worksData;
        try {
            worksData = JSON.parse(masterElement.dataset.works);
        } catch (e) {
            console.error("Ошибка при парсинге JSON:", e);
            alert("Ошибка: Некорректные данные о работах мастера.");
            return;
        }

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
        modal?.classList.remove('show'); // Optional chaining
        modal?.style.display = 'none'; // Optional chaining
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
    if (carouselPrevBtn && carouselNextBtn) {
        carouselPrevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        carouselNextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });
    } else {
        console.error('Не удалось загрузить элементы карусели');
    }

    // Обработчик клика для открытия модального окна
    mastersContainer?.addEventListener('click', function(event) { // Optional chaining
        const masterElement = event.target.closest('.show-works-button')?.closest('.master'); // Optional chaining
        if (masterElement) {
            openModal(masterElement);
        }
    });

    // Обработчик клика для закрытия модального окна
    closeBtn?.addEventListener('click', closeModal); // Optional chaining

    // Закрытие модального окна при клике вне его
    modal?.addEventListener('click', function(event) { // Optional chaining
        if (event.target === modal) {
            closeModal();
        }
    });
});

// == Код для открытия окна чата ==
$(document).ready(function() {  // **1. Удалите эту строку**

    // Скрываем окно чата при загрузке страницы
    $("#popUp").css("margin-left", "-425px");

    //  Обработчик открытия окна
    $("#openFormButton").click(function() {
        $("#popUp").css("margin-left", "0px");
        $("#darkBack").fadeIn(); // Показываем затемненный фон
    });

    //  Обработчик закрытия окна
    $("#close").click(function() {
        $("#popUp").css("margin-left", "-425px");
        $("#darkBack").fadeOut(); // Скрываем затемненный фон
    });

