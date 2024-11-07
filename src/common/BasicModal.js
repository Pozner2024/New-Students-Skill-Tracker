export default class BasicModal {
  constructor({
    id = "basicModal",
    customClass = "modal-overlay",
    buttonText = "Закрыть",
    buttonAction = null,
  }) {
    this.id = id;
    this.customClass = customClass;
    this.buttonText = buttonText;
    this.buttonAction = buttonAction || this.closeModal.bind(this); // Действие по умолчанию — закрыть окно
  }

  // Метод для рендеринга модального окна
  render() {
    return `
      <div id="${this.id}" class="${this.customClass}">
        <div class="modal-content">
          <button id="${this.id}-closeModal" class="close-button">×</button>
          <div class="modal-body"></div>
          <button id="${this.id}-actionButton" class="action-button">${this.buttonText}</button> <!-- Кнопка внизу окна -->
        </div>
      </div>
    `;
  }

  // Метод для отображения модального окна с контентом
  showModal(content) {
    // Проверяем, есть ли уже модальное окно в DOM
    if (!document.getElementById(this.id)) {
      document.body.insertAdjacentHTML("beforeend", this.render());
    }

    // Заполняем контейнер модального окна динамическим контентом
    document.querySelector(`#${this.id} .modal-body`).innerHTML = content;

    // Делаем модальное окно видимым
    document.getElementById(this.id).style.display = "flex";

    // Блокируем прокрутку страницы
    document.body.style.overflow = "hidden";

    // Добавляем обработчик для кнопки закрытия крестика
    document
      .getElementById(`${this.id}-closeModal`)
      .addEventListener("click", () => {
        this.closeModal();
      });

    // Добавляем обработчик для кнопки действия (например, "Закрыть")
    document
      .getElementById(`${this.id}-actionButton`)
      .addEventListener("click", this.buttonAction);

    // Закрытие при клике вне модального окна
    document.getElementById(this.id).addEventListener("click", (event) => {
      if (event.target === document.getElementById(this.id)) {
        this.closeModal();
      }
    });
  }

  // Метод для закрытия модального окна
  closeModal() {
    const modal = document.getElementById(this.id);
    if (modal) {
      modal.style.display = "none"; // Скрываем модальное окно
      document.body.style.overflow = "auto"; // Восстанавливаем прокрутку страницы
    }
  }
}
