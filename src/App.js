import Router from "./router";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

import "./normalize.css";
import "./App.css";
import "./Modal.css";
import "./Test.css";
import "./CubeLoader.css";
import "./SkillProgressBar.css";
import "./Form.css";
import "./Profile.css";
import "./Criteria.css";

const App = (root) => {
  // Обозначаем id контейнера для отрисовки страниц
  const containerId = "content";

  // Создаем экземпляры компонентов Header, Menu, Footer
  const headerComponent = new Header();
  const menuComponent = new Menu();
  const footerComponent = new Footer();

  // Отрисовываем статические компоненты (Header, Menu, Footer) и контейнер для страниц
  root.insertAdjacentHTML(
    "beforeend",
    `
    ${headerComponent.render()}   <!-- Отображаем Header -->
    ${menuComponent.render()}     <!-- Отображаем Menu -->
    <section id="${containerId}" class="content"></section>
    ${footerComponent.render()}   <!-- Отображаем Footer -->
    `
  );

  // Инициализируем роутер при первой загрузке
  Router(containerId);

  // Обработка навигации через popstate (переход по ссылкам назад/вперед)
  window.addEventListener("popstate", () => Router(containerId));

  // Перехватываем все клики по ссылкам меню для работы с роутером
  document.body.addEventListener("click", (event) => {
    const el = event.target;
    if (el.classList.contains("menu__link")) {
      event.preventDefault(); // Отменяем переход по ссылке

      // Обновляем URL через history.pushState
      const href = el.getAttribute("href");
      window.history.pushState({}, "", href); // Обновляем URL без перезагрузки страницы

      // Обновляем контент страницы, вызывая роутер с контейнером
      Router(containerId);
    }
  });
}; // Закрываем функцию App

export default App;
