/**
 * @file film-list-empty-view.js
 * @description
 * Файл содержит реализацию класса FilmListEmptyView, который отвечает за отображение сообщения о том, что в базе данных нет фильмов.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения секции с классом "films-list", которая будет содержать заголовок с текстом "There are no movies in our database".
 */
import AbstractView from '../../framework/view/abstract-view.js';

const createFilmListEmptyViewTemplate = () =>
  `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </div>
  `;

export default class FilmListEmptyView extends AbstractView {
  get template() {
    return createFilmListEmptyViewTemplate();
  }
}
