const path = require('path'); // Подключаем модуль Node.js для работы с путями на компьютере
const CopyPlugin = require("copy-webpack-plugin"); // Подключаем плагин, который будет копировать файлы в финальную сборку

module.exports = {
  entry: './src/main.js', // Указывает точку входа - наш главный JavaScript-файл проекта
  output: {
    filename: 'bundle.js', // Задаём название итоговому бандлу
    path: path.resolve(__dirname, 'build'), // Указываем, куда нужно положить бандл после создания
    clean: true, // Отмечаем, что перед сохранением обновлённого бандла старые файлы нужно удалить
  },
  devtool: 'source-map', // Аквтивируем генерацию source-maps
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ['babel-loader']
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        }
    ]
  }
};
