/**
 * @file extra-presenter.js
 * @description
 * Файл содержит реализацию класса ExtraPresenter, который отвечает за управление отображением дополнительных списков фильмов, таких как "Most commented" и "Top rated".
 * Класс взаимодействует с данными о фильмах и функцией сортировки для получения отсортированного списка фильмов и отображения его в представлении FilmExtraView.
 * В конструкторе класса принимаются тип дополнительного списка (extraType), массив фильмов и функция сортировки. Класс также содержит методы для получения контейнера для отображения дополнительного списка, компонента дополнительного списка и отсортированного списка фильмов.
 * Метод init() отвечает за инициализацию представления дополнительного списка, создавая новый компонент FilmExtraView с типом дополнительного списка и отображая его в контейнере. Метод films() возвращает отсортированный список фильмов, ограниченный первыми двумя элементами.
 * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонента дополнительного списка в DOM.
 */

import FilmExtraView from '../view/film-list/film-list-extra-view.js';
import FilmListContainerView from '../view/film-list/film-list-container-view.js';

export default class ExtraPresenter {
  #extraType = null;
  #films = null;
  #sortFunction = null;

  #filmsComponent = null;
  #filmsListContainerComponent = new FilmListContainerView();

  constructor({extraType,films, sortFunction}) {
    this.#extraType = extraType;
    this.#films = films;
    this.#sortFunction = sortFunction;

    this.#filmsComponent = new FilmExtraView(this.#extraType);
  }

  get container () {
    return this.#filmsListContainerComponent;
  }

  get component() {
    return this.#filmsComponent;
  }

  get films() {
    return [...this.#films].
      sort(this.#sortFunction).
      slice(0, 2);
  }
}
