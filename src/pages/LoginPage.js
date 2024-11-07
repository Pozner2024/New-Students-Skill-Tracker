import {
  auth,
  database,
  signInUser,
  registerUser,
  saveUserProfile,
} from "../utils/firebaseStorage";
import CubeLoader from "../common/CubeLoader";
import logo from "../assets/logo_vgik.png";

// Функция для рендеринга страницы логина
export function renderLoginPage() {
  const root = document.getElementById("root");
  document.title = "StudentSkillTracker";
  root.classList.add("login-page");

  if (!root) {
    console.error('Элемент с id "root" не найден.');
    return;
  }

  // Вставляем HTML для формы входа/регистрации
  root.innerHTML = `
    <div class="page-background">
      <div class="main-container">
        <div class="text-section">
          <img src="${logo}" alt="Логотип УО ВГИК" class="logo">
          <h1>Система контроля и оценки компетенций обучающихся по учебному предмету "Специальная технология".</h1>
          <p>Специальность: "Обслуживание и изготовление продукции в общественном питании". Квалификация: "Кондитер 4 разряда".</p>
        </div>
        <div class="login-wrapper">
          <div class="form-box">
            <h2>Вход</h2>
            <div class="input-group">
              <label for="email">Логин</label>
              <input type="email" id="email" placeholder="Введите Ваш емейл" required>
            </div>
            <div class="input-group">
              <label for="password">Пароль</label>
              <input type="password" id="password" placeholder="******" required>
            </div>
            <button id="login-btn" class="submit-btn">Войти</button>
            <button id="register-btn" class="submit-btn register-btn">Зарегистрироваться</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Создаем экземпляр лоадера
  const loader = new CubeLoader();

  // Обработчики для кнопок
  document
    .getElementById("login-btn")
    .addEventListener("click", () => handleLogin(loader)); // Передаем loader
  document
    .getElementById("register-btn")
    .addEventListener("click", () => handleRegister(loader)); // Передаем loader
}

// Функция для обработки логина
function handleLogin(loader) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (validateInput(email, password)) {
    loader.show(); // Показываем лоадер во время выполнения запроса

    signInUser(email, password)
      .then((userCredential) => {
        console.log("Успешный вход:", userCredential.user);
        loader.hide(); // Скрываем лоадер после завершения запроса
        window.location.href = "/";
      })
      .catch((error) => {
        loader.hide(); // Скрываем лоадер в случае ошибки
        console.error("Ошибка при входе:", error);
        alert("Ошибка при входе: " + error.message);
      });
  }
}

// Функция для регистрации пользователя
function handleRegister(loader) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (validateInput(email, password)) {
    loader.show(); // Показываем лоадер во время выполнения запроса

    registerUser(email, password)
      .then((user) => {
        console.log("User registered successfully:", user);

        // Сохранение профиля пользователя
        saveUserProfile(user.uid, email)
          .then(() => {
            alert(
              "Ваши данные успешно зарегистрированы. Войдите для продолжения."
            );
            loader.hide(); // Скрываем лоадер после завершения
            window.location.href = "/"; // Перенаправляем на главную страницу
          })
          .catch((error) => {
            console.error("Ошибка при сохранении профиля:", error);
            loader.hide();
            alert("Ошибка при сохранении профиля: " + error.message);
          });
      })
      .catch((error) => {
        loader.hide(); // Скрываем лоадер в случае ошибки
        console.error("Ошибка при регистрации:", error);
        alert("Ошибка при регистрации: " + error.message);
      });
  }
}

// Функция для проверки корректности ввода
function validateInput(email, password) {
  if (!email || !password) {
    alert("Пожалуйста, введите email и пароль");
    return false;
  }
  if (!email.includes("@")) {
    alert("Пожалуйста, введите корректный email");
    return false;
  }
  if (password.length < 6) {
    alert("Пароль должен содержать минимум 6 символов");
    return false;
  }
  return true;
}
