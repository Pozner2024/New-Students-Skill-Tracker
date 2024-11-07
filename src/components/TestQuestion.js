// // Этот класс TestQuestion управляет процессом тестирования, включая загрузку теста, рендеринг вопросов,
// // управление ответами, оценку результатов и отображение прогресса.

import TestLoader from "../components/TestLoader";
import AnswerManager from "../components/AnswerManager";
import QuestionRenderer from "../components/QuestionRenderer";
import QuestionNavigator from "../components/QuestionNavigator";
import ScoreCalculator from "../components/ScoreCalculator";
import ResultDisplay from "../components/ResultDisplay";
import SkillProgressBar from "../components/SkillProgressBar";
import ImageLoader from "../components/ImageLoader"; // Импортируем ImageLoader

class TestQuestion {
  constructor(containerId) {
    this.containerId = containerId;
    this.testLoader = new TestLoader();
    this.testInstance = null;
    this.answerManager = new AnswerManager();
    this.questionRenderer = new QuestionRenderer(this.answerManager);
    this.navigator = null;
    this.scoreCalculator = null;
    this.resultDisplay = null;
    this.imageLoader = null; // Добавляем свойство для ImageLoader
    this.topicName = null; // Свойство для хранения названия темы
  }

  async initialize() {
    // Извлекаем topicId и variant из URL
    const { topicId, variant } = this.testLoader.getParamsFromURL();
    const testResult = await this.testLoader.fetchTestData(topicId, variant);

    if (!testResult || !Array.isArray(testResult.data.questions)) {
      console.error("Test data is missing or incorrect");
      return;
    }

    this.topicName = testResult.topicName;
    this.testInstance = testResult.data;

    // Инициализируем ImageLoader после получения topicId и variant
    this.imageLoader = new ImageLoader(topicId, variant);

    // Проверка на корректную загрузку testInstance и questions
    if (!this.testInstance || !Array.isArray(this.testInstance.questions)) {
      console.error(
        "Test instance or questions array is not initialized correctly"
      );
      return;
    }

    // Инициализируем ScoreCalculator и ResultDisplay
    this.scoreCalculator = new ScoreCalculator(this.testInstance);
    this.resultDisplay = new ResultDisplay(this.testInstance);

    // Инициализируем QuestionNavigator с проверками
    this.navigator = new QuestionNavigator(
      this.testInstance.questions.length,
      (index) => this.renderCurrentQuestion(index),
      () => this.submitAllAnswers()
    );

    // Рендерим первый вопрос
    this.renderCurrentQuestion(this.navigator.currentQuestionIndex);
  }

  getTotalQuestions() {
    return this.navigator ? this.navigator.getTotalQuestions() : 0;
  }

  renderCurrentQuestion(index) {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id '${this.containerId}' not found`);
      return;
    }

    const questions = this.testInstance.questions;
    if (index < 0 || index >= questions.length) {
      console.error(`Invalid question index: ${index}`);
      return;
    }

    // Получаем изображение для текущего вопроса по его номеру
    const imagePath = this.imageLoader.getImagePath(index + 1); // Номер вопроса соответствует индексу + 1

    // Рендерим HTML для текущего вопроса, включая изображение (если оно есть)
    container.innerHTML =
      `<h3>Вопрос ${index + 1} из ${questions.length}</h3>` +
      this.questionRenderer.renderQuestionHTML(
        questions[index],
        index,
        imagePath
      ); // Передаем imagePath в renderQuestionHTML

    // Добавляем обработчики для ответов
    this.questionRenderer.addAnswerHandlers(container, index);

    // Обновляем навигацию
    this.navigator.updatePagination();
  }

  showNextQuestion() {
    if (this.navigator) {
      this.navigator.showNextQuestion();
    } else {
      console.error("Navigator is not initialized");
    }
  }

  showPreviousQuestion() {
    if (this.navigator) {
      this.navigator.showPreviousQuestion();
    } else {
      console.error("Navigator is not initialized");
    }
  }

  submitAllAnswers() {
    let userAnswers = this.answerManager.getAllAnswers();
    if (typeof userAnswers === "object" && !Array.isArray(userAnswers)) {
      userAnswers = Object.values(userAnswers);
    }

    if (!Array.isArray(userAnswers)) {
      console.error("User answers are not in the expected format");
      return;
    }

    // Рассчитываем общий балл и процент завершенных ответов
    const totalScore = this.scoreCalculator.calculateTotalScore(userAnswers);
    const answeredPercentage =
      this.scoreCalculator.getAnsweredPercentage(userAnswers);

    // Находим контейнер для отображения результата
    const contentContainer = document.getElementById("content");
    if (!contentContainer) {
      console.error("Content container for results is missing");
      return;
    }

    // Отображаем страницу с результатами
    this.resultDisplay.displayResultsPage(totalScore);

    // Создаем и отображаем шкалу прогресса навыка
    const skillProgressBar = new SkillProgressBar(
      answeredPercentage,
      totalScore,
      this.resultDisplay.getGrade(
        totalScore,
        this.testInstance.questions.length
      ),
      this.topicName
    );
    skillProgressBar.render("content");
  }
}

export default TestQuestion;
