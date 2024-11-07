// Этот код представляет класс ImageLoader, который загружает изображения для вопросов по шаблону и предоставляет путь
//  к изображению по номеру вопроса.
//  Конструктор: Инициализирует тему (topicId) и вариант (variant), а затем загружает изображения методом loadImages().
// loadImages(): Загружает изображения из папки assets и фильтрует их по заданным параметрам (тема и вариант).
// getImagePath(): Возвращает путь к изображению для вопроса по номеру или null, если изображение отсутствует.

class ImageLoader {
  constructor(topicId, variant) {
    this.topicId = topicId;
    this.variant = variant;
    this.images = this.loadImages(); // Загружаем изображения из общего пути
  }

  // Метод для загрузки всех изображений из папки `assets`
  loadImages() {
    try {
      // Статический путь к папке `assets`
      const images = require.context("../assets", true, /\.(png|jpe?g|svg)$/);

      // Фильтруем изображения по имени, проверяя соответствие шаблону `img{topicId}_{variant}/{номер}.jpg`
      const imageMap = {};
      images.keys().forEach((fileName) => {
        // Проверяем, соответствует ли файл шаблону для topicId и variant
        if (fileName.includes(`img${this.topicId}_${this.variant}/`)) {
          // Извлекаем номер вопроса из имени файла, например, `1.jpg` -> 1
          const questionNumber = parseInt(fileName.match(/(\d+)\./)[1], 10);
          imageMap[questionNumber] = images(fileName);
        }
      });

      return imageMap;
    } catch (error) {
      console.error("Не удалось загрузить изображения:", error);
      return {};
    }
  }

  // Метод для получения пути к изображению по номеру вопроса
  getImagePath(questionNumber) {
    return this.images && this.images[questionNumber]
      ? this.images[questionNumber]
      : null;
  }
}

export default ImageLoader;
