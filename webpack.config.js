const Dotenv = require("dotenv-webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development", // или "production"
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, ".env"), // Указываем путь к файлу .env
      systemvars: true, // Загружаем системные переменные окружения
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "_redirects"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }), // Плагин для копирования файла _redirects
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Форматы изображений
        type: "asset/resource", // Используем встроенный механизм Webpack 5 для загрузки ресурсов
        generator: {
          filename: "images/[name][ext]", // Куда сохранять файлы
        },
      },
    ],
  },
  devtool: false, // Отключаем карты исходного кода
};
