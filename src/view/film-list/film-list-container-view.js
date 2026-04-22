/**
 * @file film-list-container-view.js
 * @description
 * Файл содержит реализацию класса FilmListContainerView, который отвечает за отображение контейнера для списка фильмов.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения блока с классом "films-list__container", который будет содержать список фильмов.
 */

import AbstractView from '../../framework/view/abstract-view.js';

const createFilmListContainerViewTemplate = () => '<div class="films-list__container"></div>';

export default class FilmListContainerView extends AbstractView {
  get template() {
    return createFilmListContainerViewTemplate();
  }
}
