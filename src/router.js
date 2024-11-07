// Импорт Firebase аутентификации из файла утилит
import { auth, signInUser } from "./utils/firebaseStorage"; // Путь к файлу firebaseStorage.js
import { onAuthStateChanged } from "firebase/auth"; // Функция отслеживания состояния пользователя

import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Contacts from "./pages/Contacts.js";
import CriteriaPage from "./pages/Criteria.js";
import ProfilePage from "./pages/Profile.js";
import Error404 from "./pages/Error404.js";
import TestPage from "./pages/TestPage.js";
import { renderLoginPage } from "./pages/LoginPage.js"; // Подключаем функцию для рендеринга страницы логина

// Объявляем объект роутов с экземплярами классов и страницей логина
const routes = {
  "/": new Home(),
  "/about": new About(),
  "/contacts": new Contacts(),
  "/criteria": new CriteriaPage(),
  "/profile": new ProfilePage(),
  "/test-page": new TestPage(),
  "/404": new Error404(),
  "/login": { renderPage: renderLoginPage }, // Страница логина
};

// Функция входа пользователя (signInUser)
const handleLogin = (email, password) => {
  signInUser(email, password)
    .then(() => {
      loginAndRedirect(); // Перенаправляем на главную после успешного входа
    })
    .catch((error) => {
      console.error("Ошибка входа:", error); // Обработка ошибки входа
    });
};

// Функция выхода пользователя
const logoutUser = () => {
  auth
    .signOut() // Выход из Firebase аутентификации
    .then(() => {
      window.history.pushState({}, "", "/login"); // Перенаправляем на страницу логина
      Router(); // Перерисовываем контент
    })
    .catch((error) => {
      console.error("Ошибка при выходе:", error);
    });
};

// Функция получения компонента из объекта роутов
const getComponentFromPath = (path) => {
  if (path === "/logout") {
    logoutUser();
    return null;
  }
  return routes[path] || routes["/404"];
};

// Функция перерисовки компонентов
const updateDOM = (root, component) => {
  if (!root) {
    console.error("Specified root container not found in the document.");
    return;
  }

  root.innerHTML = ""; // Очищаем содержимое контейнера

  if (component) {
    document.title = component.metaTitle || "Default Title"; // Устанавливаем мета-заголовок страницы
    if (typeof component.renderPage === "function") {
      root.insertAdjacentHTML("beforeend", component.renderPage()); // Рендерим компонент
    } else {
      console.error("The component does not have a renderPage method");
    }
  }
};

// Обновление активной ссылки в меню
const setActiveLink = (path = "/") => {
  const links = document.querySelectorAll(".menu__link");
  links.forEach((link) => {
    link.classList.toggle("active", path === link.getAttribute("href"));
  });
};

// Функция получения текущего пути
const getCurrentPath = () => {
  let path = window.location.pathname || "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
};

// Функция для перенаправления после успешного входа
export const loginAndRedirect = () => {
  window.history.pushState({}, "", "/"); // Обновляем URL для главной страницы
  Router(); // Перерисовываем содержимое страницы
};

// Функция инициализации роутера
const Router = (container = "content") => {
  const root = document.getElementById(container);
  if (!root) {
    console.error(
      `Specified container with id "${container}" not found in the document.`
    );
    return;
  }

  // Функция для получения текущего пути из URL
  const path = getCurrentPath();

  // Проверяем, авторизован ли пользователь через Firebase Authentication
  onAuthStateChanged(auth, (user) => {
    if (!user && path !== "/login") {
      // Если пользователь не авторизован и не находится на странице логина, перенаправляем на страницу логина
      window.history.pushState({}, "", "/login");
      return updateDOM(root, routes["/login"]); // Рендерим страницу логина
    }

    if (user) {
      // Если пользователь авторизован, получаем соответствующий компонент
      const component = getComponentFromPath(path);
      updateDOM(root, component); // Перерисовываем содержимое
      setActiveLink(path); // Обновляем активные ссылки в меню
    }
  });
};

// Инициализация роутера при загрузке страницы
window.addEventListener("load", () => Router());

// Перерисовка контента при изменении истории
window.addEventListener("popstate", () => Router());

export default Router;
