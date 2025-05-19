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

  //  Функциональность для формы обратной связи
  const openFormButton = document.getElementById('openFormButton');
  const closeFormButton = document.getElementById('closeFormButton');
  const contactFormContainer = document.getElementById('contactFormContainer');
  const contactForm = document.getElementById('contactForm');

  if (openFormButton && closeFormButton && contactFormContainer && contactForm) {
    openFormButton.addEventListener('click', function() {
      contactFormContainer.style.display = 'block';
    });

    closeFormButton.addEventListener('click', function() {
      contactFormContainer.style.display = 'none';
    });

    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); //  Предотвращаем отправку формы по умолчанию

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      //  Отправляем данные на сервер
      fetch('https://my-telegram-bot.onrender.com/send-to-bot', {
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
          const messageSentDiv = document.getElementById('messageSent');
          if (response.ok) {
            messageSentDiv.textContent = 'отправлено!';
            contactForm.reset();
          } else {
            messageSentDiv.textContent = 'Ошибка';
          }
        })
        .catch(error => {
          const messageSentDiv = document.getElementById('messageSent');
          console.error('Ошибка:', error);
          messageSentDiv.textContent = 'Ошибка';
        });
    });
  } else {
    console.warn('Не найден один или несколько элементов формы обратной связи.');
  }

  const toggleAdminPanelButton = document.getElementById('toggleAdminPanelButton');
  const adminPanelContainer = document.getElementById('adminPanelContainer');
  const messagesTableBody = document.getElementById('messagesTableBody');
  const passwordModal = document.getElementById('passwordModal');
  const overlay = document.getElementById('overlay');
  const confirmPasswordButton = document.getElementById('confirmPasswordButton');
  const adminPasswordInput = document.getElementById('adminPassword');

  const adminPassword = 'admin'; // Замените на ваш пароль
  let isAdminPanelVisible = false;

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
});
