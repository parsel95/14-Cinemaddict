/**
 * @file film-list-loading-view.js
 * @description
 * Файл содержит реализацию класса FilmListLoadingView, который отвечает за отображение состояния загрузки списка фильмов.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения секции с классом "films", которая будет содержать заголовок "Loading...".
 */
import AbstractView from '../../framework/view/abstract-view';

const createFilmListLoadingViewTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`
);

export default class FilmListLoadingView extends AbstractView {
  get template () {
    return createFilmListLoadingViewTemplate();
  }
}
