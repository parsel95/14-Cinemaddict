/**
 * @file footer-statistics-presenter.js
 * @description
 * Файл содержит реализацию класса FooterStatisticsPresenter, который отвечает за управление отображением статистики фильмов в подвале сайта.
 * Класс взаимодействует с моделью фильмов для получения количества фильмов и обновляет представление статистики при изменении данных в модели.
 * В конструкторе класса принимаются контейнер для отображения статистики и модель фильмов. Класс также добавляет себя в качестве наблюдателя к модели фильмов, чтобы реагировать на изменения данных и обновлять статистику соответственно.
 * Метод init() отвечает за инициализацию представления статистики, создавая новый компонент FooterStatisticsView с текущим количеством фильмов и отображая его в контейнере. Метод #modelEventHandler() обрабатывает события от модели фильмов и вызывает метод init() для обновления статистики при получении события типа UpdateType.INIT.
 * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонента статистики в подвале сайта. При первом отображении компонента используется метод render, а при последующих обновлениях используется метод replace для замены старого компонента новым, и метод remove для удаления старого компонента из DOM.
 */

import FooterStatisticsView from '../view/footer-statistics-view.js';
import {remove, render, replace} from '../framework/render';
import {UpdateType} from '../const.js';

export default class FooterStatisticsPresenter {
  #container = null;
  #footerStatisticsComponent = null;

  #filmsModel = null;

  #filmCount = null;

  constructor(container, filmModel) {
    this.#container = container;
    this.#filmsModel = filmModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#filmCount = this.#filmsModel.get().length;

    const prevFooterStatisticsComponent = this.#footerStatisticsComponent;

    this.#footerStatisticsComponent = new FooterStatisticsView(this.#filmCount);

    if (prevFooterStatisticsComponent === null) {
      render(this.#footerStatisticsComponent, this.#container);
      return;
    }

    replace(this.#footerStatisticsComponent, prevFooterStatisticsComponent);
    remove(prevFooterStatisticsComponent);
  }

  #modelEventHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.init();
    }
  };
}
