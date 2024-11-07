// // Класс TestPage представляет собой компонент веб-приложения для отображения страницы с
// // тестовыми вопросами. Он включает в себя структуру страницы, заголовок, навигацию
// //  по вопросам и обработку загрузки данных.

import TestQuestion from "../components/TestQuestion";
import Pagination from "../components/Pagination";
import CubeLoader from "../common/CubeLoader"; // Импортируем CubeLoader

class TestPage {
  constructor({
    id = "test-page",
    content = "Данные загружаются...",
    metaTitle = "Данные загружаются...",
  } = {}) {
    this.id = id;
    this.content = content;
    this.metaTitle = metaTitle;
    this.testQuestion = null;
    this.pagination = null;
    this.loader = new CubeLoader(); // Создаем экземпляр лоадера
  }

  renderPageStructure(
    title = "Данные загружаются...",
    variant = "Данные загружаются..."
  ) {
    document.title = this.metaTitle;

    return `
      <main id="${this.id}" class="container">
  <div class="test-page-styles">
    <div class="test-info">
      <h2>${title}</h2>
      <p>Вариант: ${variant}</p>
    </div>
    <div id="indicator-panel" class="indicator-panel"></div>
    <div id="questions-panel" class="questions-panel"></div>
    <div class="navigation-panel">
      <button id="prevButton" class="nav-button">Назад</button>
      <button id="nextButton" class="nav-button">Вперед</button>
      <button id="finishButton" class="nav-button finish-button">Завершить тест и показать результаты теста</button>
    </div>
  </div> <!-- Закрывающий тег для test-page-styles -->
</main>
    `;
  }

  renderLoadingPage() {
    const contentElement = document.getElementById("content");
    if (contentElement) {
      contentElement.innerHTML = this.renderPageStructure();
    }
  }

  renderPage(title, variant) {
    const contentElement = document.getElementById("content");
    this.metaTitle = title;
    document.title = this.metaTitle;
    if (contentElement) {
      contentElement.innerHTML = this.renderPageStructure(title, variant);
    }
  }

  async init() {
    this.loader.show(); // Показываем лоадер перед загрузкой данных

    try {
      this.renderLoadingPage();
      this.testQuestion = new TestQuestion("questions-panel");
      await this.testQuestion.initialize();

      const title = this.testQuestion.testInstance?.testTitle || "Тест";
      const variant = this.testQuestion.testInstance?.variant || "1";

      this.renderPage(title, variant);

      // Проверяем, что navigator инициализирован в TestQuestion перед его использованием
      if (this.testQuestion.navigator) {
        const totalQuestions = this.testQuestion.getTotalQuestions();
        this.pagination = new Pagination(totalQuestions, "indicator-panel");

        this.pagination.onPageChange = (pageIndex) => {
          this.testQuestion.navigator.navigateToQuestion(pageIndex, true);
        };

        this.testQuestion.renderCurrentQuestion(
          this.testQuestion.navigator.currentQuestionIndex
        );
        this.pagination.changePage(
          this.testQuestion.navigator.currentQuestionIndex
        );

        document.getElementById("prevButton").onclick = () => {
          this.testQuestion.showPreviousQuestion();
          this.pagination.changePage(
            this.testQuestion.navigator.currentQuestionIndex
          );
        };

        document.getElementById("nextButton").onclick = () => {
          this.testQuestion.showNextQuestion();
          this.pagination.changePage(
            this.testQuestion.navigator.currentQuestionIndex
          );
        };

        document.getElementById("finishButton").onclick = () => {
          this.testQuestion.submitAllAnswers();
        };
      } else {
        console.error("Navigator не инициализирован в TestQuestion.");
      }
    } finally {
      this.loader.hide();
    }
  }
}

export default TestPage;

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("/test")) {
    const testPage = new TestPage({
      metaTitle: "Данные загружаются...",
    });
    testPage.init();
  }
});
