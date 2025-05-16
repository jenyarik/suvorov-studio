document.addEventListener('DOMContentLoaded', function() {
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

  // --- Модальное окно с работами мастеров ---
  const mastersContainer = document.querySelector('.masters-container');
  if (mastersContainer) {
    const modal = document.getElementById('worksModal');
    const modalMasterName = document.getElementById('modal-master-name');
    const modalWorksGrid = document.getElementById('modal-works-grid');
    const closeBtn = document.querySelector('.close');

    // Функция для открытия модального окна
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

  // --- Код для формы бота ---
  // Получаем элементы
  const openFormButton = document.getElementById('openFormButton');
  const closeFormButton = document.getElementById('closeFormButton');
  const contactFormContainer = document.getElementById('contactFormContainer');
  const contactForm = document.getElementById('contactForm');  // Добавляем получение элемента формы

  // Проверяем, существуют ли элементы на странице (чтобы избежать ошибок на страницах, где их нет)
  if (openFormButton && closeFormButton && contactFormContainer && contactForm) {
    // Добавляем обработчик клика на кнопку "Записаться"
    openFormButton.addEventListener('click', function() {
      contactFormContainer.style.display = 'block';
    });

    // Добавляем обработчик клика на кнопку закрытия
    closeFormButton.addEventListener('click', function() {
      contactFormContainer.style.display = 'none';
    });

    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Предотвращаем отправку формы по умолчанию

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Отправляем данные на сервер (Render)
      fetch('https://my-telegram-bot.onrender.com/send-to-bot', { // Замените URL!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      })
      .then(response => {
        const messageSentDiv = document.getElementById('messageSent'); // Получаем элемент для вывода сообщения
        if (response.ok) {
          messageSentDiv.textContent = 'Сообщение успешно отправлено!';
          contactForm.reset(); // Очищаем форму
        } else {
          messageSentDiv.textContent = 'Ошибка при отправке сообщения. Попробуйте позже.';
        }
      })
      .catch(error => {
        const messageSentDiv = document.getElementById('messageSent'); // Получаем элемент для вывода сообщения
        console.error('Ошибка:', error);
        messageSentDiv.textContent = 'Ошибка при отправке сообщения. Попробуйте позже.';
      });
    });
  } else {
    console.warn('Один или несколько элементов формы бота не найдены на этой странице.');
  }
});
