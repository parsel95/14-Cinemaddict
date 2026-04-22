/**
 * @file film-list-view.js
 * @description
 * Файл содержит реализацию класса FilmListView, который отвечает за отображение списка фильмов.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения секции с классом "films-list", которая будет содержать заголовок и список фильмов.
 */

import AbstractView from '../../framework/view/abstract-view.js';

const createFilmsViewTemplate = () =>
  `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>
  `;

export default class FilmListView extends AbstractView {
  get template() {
    return createFilmsViewTemplate();
  }
}
