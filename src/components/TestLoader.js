// Этот код загружает данные теста из Firebase Realtime Database на основе параметров,
// переданных в URL. Используя параметры URL (название темы и вариант теста),
// код обращается к Firebase и, если данные найдены, возвращает их для дальнейшего использования в приложении.

import { ref, child, get } from "firebase/database";
import { database } from "../utils/firebaseStorage";
import { TOPICS } from "../constants/constants";

class TestLoader {
  constructor() {
    this.dbRef = ref(database);
    this.topicName = ""; // Свойство для хранения названия темы
  }

  getParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const topicName = params.get("topic") || "Тема не указана";
    this.topicName = topicName;

    const variant = parseInt(params.get("variant")) || 1;

    const topicObject = TOPICS.find((topic) => topic.name === topicName);
    const topicId = topicObject ? topicObject.id : null;

    if (!topicId) {
      console.error(`Тема "${topicName}" не найдена в константах.`);
    }

    return { topicId, variant };
  }

  async fetchTestData(topicId, variant) {
    if (isNaN(topicId) || isNaN(variant)) {
      console.error(
        "Некорректные параметры topicId или variant:",
        topicId,
        variant
      );
      return null;
    }

    const path = `test${topicId}_${variant}`;

    try {
      const snapshot = await get(child(this.dbRef, path));
      if (snapshot.exists()) {
        return { data: snapshot.val(), topicName: this.topicName }; // Возвращаем данные теста и название темы
      } else {
        console.warn(`Данные не найдены по пути ${path}`);
        return null;
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      return null;
    }
  }
}

export default TestLoader;
