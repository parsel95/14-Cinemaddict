/**
 * @file film-button-more-view.js
 * @description
 * Файл содержит реализацию класса FilmButtonMoreView, который отвечает за отображение кнопки "Show more" для загрузки дополнительных фильмов.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения кнопки, а также методы для установки обработчика клика по кнопке.
 * При клике на кнопку вызывается переданный в обработчик коллбек, который может быть использован для загрузки дополнительных фильмов и их отображения на странице.
 */

import AbstractView from '../framework/view/abstract-view.js';

const createFilmButtonMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmButtonMoreView extends AbstractView {
  get template() {
    return createFilmButtonMoreTemplate();
  }

  setButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  };

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
