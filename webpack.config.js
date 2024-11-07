const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  mode: "development", // или "production"
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, ".env"), // Указываем путь к файлу .env
      systemvars: true, // Добавляем systemvars: true, чтобы загружать системные переменные окружения
    }),
  ],
  devtool: false, // Отключаем карты исходного кода
};
