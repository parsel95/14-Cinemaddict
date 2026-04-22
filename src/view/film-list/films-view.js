/**
 * @file films-view.js
 * @description
 * Файл содержит реализацию класса FilmsView, который отвечает за отображение контейнера для списка фильмов.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения секции с классом "films", которая будет содержать список фильмов.
 */

import AbstractView from '../../framework/view/abstract-view.js';

const createFilmsViewTemplate = () => '<section class="films"></section>';

export default class FilmsView extends AbstractView {
  get template() {
    return createFilmsViewTemplate();
  }
}
