import { auth } from "../utils/firebaseStorage";
import Page from "../common/Page.js";
import { saveToDatabase } from "../utils/firebaseStorage";

class ProfilePage extends Page {
  constructor() {
    super({
      id: "profile",
      title: "Ваш личный кабинет",
      content: "",
      metaTitle: "Личный кабинет",
    });
  }

  // Метод для отображения формы и email пользователя
  displayUserEmailAndForm() {
    const user = auth.currentUser; // Получаем текущего авторизованного пользователя

    if (user) {
      const email = user.email; // Получаем email пользователя

      // Возвращаем HTML с email пользователя и формой для ввода имени и группы
      return `
        <div class="profile-container">
          <h2>Добро пожаловать!</h2>
          <p>Ваш email: ${email}</p>
          <form id="profile-form">
            <label for="name">Введите Ваше имя и фамилию:</label>
            <input type="text" id="name" name="name" placeholder="Введите имя и фамилию" required>

            <label for="group">Введите номер группы:</label>
            <input type="text" id="group" name="group" placeholder="Введите номер группы" required>

            <button type="submit">Сохранить</button>
          </form>
        </div>
      `;
    } else {
      return `<p>Ошибка: Пользователь не авторизован.</p>`;
    }
  }

  // Метод для обработки отправки формы
  handleFormSubmit() {
    const user = auth.currentUser; // Получаем текущего пользователя

    if (user) {
      const profileForm = document.getElementById("profile-form");

      profileForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Останавливаем стандартную отправку формы

        const name = document.getElementById("name").value; // Получаем введенное имя
        const group = document.getElementById("group").value; // Получаем введенный номер группы

        console.log("Сохранение данных пользователя:", { name, group });

        // Формируем объект данных для сохранения
        const userData = {
          name: name,
          group: group,
          email: user.email,
        };

        // Сохраняем профиль пользователя в Firebase
        saveToDatabase(user.uid, userData)
          .then(() => {
            console.log("Данные успешно сохранены.");
            alert("Ваши данные успешно сохранены!"); // Показываем уведомление пользователю
          })
          .catch((error) => {
            console.error("Ошибка при сохранении данных:", error);
          });
      });
    } else {
      console.error("Пользователь не найден.");
    }
  }

  // Метод для рендеринга страницы
  renderPage() {
    return `
      <main id="${this.id}" class="profile">
        <h1>${this.title}</h1>
        <section>
          ${this.displayUserEmailAndForm()} <!-- Вызываем метод для отображения email и формы -->
        </section>
      </main>
    `;
  }

  // Метод для инициализации страницы
  init() {
    let root = document.getElementById("root");

    if (root) {
      let content = document.getElementById("content");
      if (!content) {
        content = document.createElement("div");
        content.id = "content";
        root.appendChild(content);
      }

      // Рендерим страницу через return
      content.innerHTML = this.renderPage();

      // Обрабатываем отправку формы
      setTimeout(() => {
        this.handleFormSubmit(); // Устанавливаем обработчик формы после рендеринга
      }, 0);
    } else {
      console.error('Контейнер с id="root" не найден.');
    }
  }
}

export default ProfilePage;
