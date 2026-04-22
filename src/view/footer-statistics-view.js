/**
 * @file footer-statistics-view.js
 * @description
 * Файл содержит реализацию класса FooterStatisticsView, который отвечает за отображение статистики фильмов в подвале сайта.
 * Класс наследуется от AbstractView и предоставляет шаблон для отображения количества фильмов, находящихся внутри приложения.
 */

import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (count = 0) => `<p>${count} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView{
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#count);
  }
}
