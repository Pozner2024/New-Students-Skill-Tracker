// Класс ScoreCalculator используется для расчета итогового балла за тест на основе
// ответов пользователя и для вычисления процента отвеченных вопросов. Он также включает
// методы для сравнения ответов пользователя с правильными ответами, учитывая особенности
// каждого типа вопроса (например, вопросы с выбором ответа, вопросы с заполнением пропусков и т.д.)

class ScoreCalculator {
  constructor(testInstance) {
    this.testInstance = testInstance;
    this.scales = {
      10: [8, 8, 8, 10, 10, 10, 10, 10, 10, 16],
      15: [4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 10, 12, 12],
    };
  }

  normalizeString(str) {
    return typeof str === "string" ? str.trim().toLowerCase() : str;
  }

  levenshteinDistance(str1, str2) {
    const dp = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i++) dp[0][i] = i;
    for (let j = 0; j <= str2.length; j++) dp[j][0] = j;
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[j][i] = Math.min(
          dp[j][i - 1] + 1,
          dp[j - 1][i] + 1,
          dp[j - 1][i - 1] + indicator
        );
        if (
          i > 1 &&
          j > 1 &&
          str1[i - 1] === str2[j - 2] &&
          str1[i - 2] === str2[j - 1]
        ) {
          dp[j][i] = Math.min(dp[j][i], dp[j - 2][i - 2] + indicator);
        }
      }
    }
    return dp[str2.length][str1.length];
  }

  jaccardSimilarityForWords(userAnswer, correctAnswer, maxDistance = 3) {
    const userWords = userAnswer.toLowerCase().split(" ");
    const correctWords = correctAnswer.toLowerCase().split(" ");
    const matchedWords = correctWords.filter((correctWord) =>
      userWords.some(
        (userWord) =>
          this.levenshteinDistance(userWord, correctWord) <= maxDistance
      )
    );
    const unionSize = new Set([...userWords, ...correctWords]).size;
    return matchedWords.length / unionSize >= 0.5;
  }

  compareArrays(arr1, arr2, allowAnyOrder = false) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      console.error(
        "One of the arrays is undefined or not an array",
        arr1,
        arr2
      );
      return false;
    }

    const normArr1 = arr1.map(this.normalizeString);
    const normArr2 = arr2.map(this.normalizeString);

    return allowAnyOrder
      ? normArr1.length === normArr2.length &&
          normArr1.every((item) => normArr2.includes(item))
      : normArr1.length === normArr2.length &&
          normArr1.every((item, index) => item === normArr2[index]);
  }

  calculateTotalScore(userAnswers) {
    const questions = this.testInstance.questions;
    const questionCount = questions.length;
    const scale = this.scales[questionCount];

    if (!scale) {
      console.error(`Нет шкалы для ${questionCount} вопросов.`);
      return 0;
    }

    let totalScore = questions.reduce((acc, question, index) => {
      const userAnswer = userAnswers[index];
      let isCorrect = false;
      let questionScore = 0;

      switch (question.type) {
        case "multiple_choice":
          isCorrect =
            this.normalizeString(userAnswer) ===
            this.normalizeString(question.correct_answer);
          questionScore = isCorrect ? scale[index] : 0;
          console.log(
            `Вопрос ${index + 1} (multiple_choice):\n` +
              `Ответ пользователя: ${userAnswer}\n` +
              `Правильный ответ: ${question.correct_answer}\n` +
              `Верно: ${isCorrect}, Начисленные баллы: ${questionScore}`
          );
          break;

        case "fill_in_the_blank":
          if (
            Array.isArray(userAnswer) &&
            Array.isArray(question.correct_answers)
          ) {
            isCorrect =
              this.compareArrays(
                userAnswer,
                question.correct_answers,
                question.allow_any_order
              ) ||
              this.jaccardSimilarityForWords(
                userAnswer.join(" "),
                question.correct_answers.join(" ")
              );
            questionScore = isCorrect ? scale[index] : 0;
            console.log(
              `Вопрос ${index + 1} (fill_in_the_blank):\n` +
                `Ответ пользователя: ${userAnswer}\n` +
                `Правильные ответы: ${question.correct_answers}\n` +
                `Верно: ${isCorrect}, Начисленные баллы: ${questionScore}`
            );
          }
          break;

        case "matching":
          if (
            typeof userAnswer === "object" &&
            typeof question.correct_matches === "object"
          ) {
            isCorrect = Object.keys(question.correct_matches).every(
              (key) =>
                this.normalizeString(userAnswer[key]) ===
                this.normalizeString(question.correct_matches[key])
            );
            questionScore = isCorrect ? scale[index] : 0;
            console.log(
              `Вопрос ${index + 1} (matching):\n` +
                `Ответ пользователя: ${JSON.stringify(userAnswer)}\n` +
                `Правильные соответствия: ${JSON.stringify(
                  question.correct_matches
                )}\n` +
                `Верно: ${isCorrect}, Начисленные баллы: ${questionScore}`
            );
          }
          break;

        case "ordering":
          // Используем `correctOrder`, загруженный из Firebase
          if (
            Array.isArray(userAnswer) &&
            Array.isArray(question.correctOrder)
          ) {
            const correctOrder = question.correctOrder;
            const matches = userAnswer.reduce(
              (acc, item, i) => acc + (item === correctOrder[i] ? 1 : 0),
              0
            );
            const matchPercentage = (matches / correctOrder.length) * 100;

            if (matchPercentage > 50) {
              questionScore = scale[index];
            } else if (matchPercentage === 50) {
              questionScore = scale[index] * 0.5;
            }

            console.log(
              `Вопрос ${index + 1} (ordering):\n` +
                `Ответ пользователя: ${userAnswer}\n` +
                `Правильный порядок: ${correctOrder}\n` +
                `Процент совпадений: ${matchPercentage}%\n` +
                `Начисленные баллы: ${questionScore}`
            );
          }
          break;

        default:
          console.error(`Неизвестный тип вопроса: ${question.type}`);
      }

      return acc + questionScore;
    }, 0);

    return totalScore;
  }

  getAnsweredPercentage(userAnswers) {
    const totalQuestions = this.testInstance.questions.length;
    const answeredQuestionsCount = userAnswers.filter(
      (answer) => answer !== undefined
    ).length;
    return totalQuestions ? (answeredQuestionsCount / totalQuestions) * 100 : 0;
  }
}

export default ScoreCalculator;
