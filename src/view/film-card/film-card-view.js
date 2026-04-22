/**
 * @file film-card-view.js
 * @description
 * Файл содержит реализацию класса FilmCardView, который отвечает за отображение карточки фильма в списке фильмов.
 * Класс наследуется от AbstractStatefulView и предоставляет шаблон для отображения карточки фильма, которая содержит информацию о фильме, количество комментариев и контролы для управления фильмом (добавление в список "watchlist", отметка как просмотренного и добавление в избранное).
 * В конструкторе класса принимаются данные о фильме, его комментариях, а также флаг, указывающий на то, что фильм находится в процессе редактирования. На основе этих данных формируется шаблон для отображения карточки фильма.
 */

import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {createCardInfoTemplate} from './film-card-info-template.js';
import {createFilmCardControlsTemplate} from './film-card-controls-template.js';

const createNewPopupTemplate = ({filmInfo, comments, userDetails, isFilmEditing}) =>
  `
    <article class="film-card">

      ${createCardInfoTemplate(filmInfo, comments.length)}

      ${createFilmCardControlsTemplate(userDetails, isFilmEditing)}

    </article>
  `;

export default class FilmCardView extends AbstractStatefulView {
  constructor(film) {
    super();
    this._state = FilmCardView.parseFilmToState(film);
  }

  get template() {
    return createNewPopupTemplate(this._state);
  }

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-card__controls');
    this.shake.call({element: controlsElement});
  };

  _restoreHandlers = () => {
    this.setCardClickHandler(this._callback.cardClick);
    this.setWatchlistBtnClickHandler(this._callback.watchlistBtnClick);
    this.setWatchedBtnClickHandler(this._callback.watchedBtnClick);
    this.setFavoriteBtnClickHandler(this._callback.favoriteBtnClick);
  };

  setCardClickHandler(callback) {
    this._callback.cardClick = callback;
    this.element
      .querySelector('a')
      .addEventListener('click', this.#cardClickHandler);
  }

  setWatchlistBtnClickHandler(callback) {
    this._callback.watchlistBtnClick = callback;
    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistBtnClickHandler);
  }

  setWatchedBtnClickHandler(callback) {
    this._callback.watchedBtnClick = callback;
    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedBtnClickHandler);
  }

  setFavoriteBtnClickHandler(callback) {
    this._callback.favoriteBtnClick = callback;
    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteBtnClickHandler);
  }

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };

  #watchlistBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistBtnClick();
  };

  #watchedBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedBtnClick();
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteBtnClick();
  };

  static parseFilmToState = (film) => ({
    ...film,
    isFilmEditing: false
  });
}
