/**
 * @file film-list-extra-view.js
 * @description
 * Файл содержит реализацию класса FilmExtraView, который отвечает за отображение дополнительных списков фильмов, таких как "Most commented" и "Top rated".
 * Класс наследуется от AbstractStatefulView и предоставляет шаблон для отображения секции с классом "films-list--extra", которая будет содержать заголовок с типом списка.
 * Тип списка передается в конструктор класса и может быть либо "Most commented", либо "Top rated". В зависимости от типа списка, заголовок будет отображать соответствующий текст.
 */

import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

const createFilmExtraTemplate = (type) =>
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">
        ${(type === 'Most commented') ? 'Most commented' : 'Top rated' }
      </h2>
    </section>
  `;
export default class FilmExtraView extends AbstractStatefulView {
  #type = null;

  constructor(type) {
    super();
    this.#type = type;
  }

  get template() {
    return createFilmExtraTemplate(this.#type);
  }
}
