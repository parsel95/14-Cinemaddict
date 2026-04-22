/**
 * @file filter-presenter.js
 * @description
 * Файл содержит реализацию класса FilterPresenter, который отвечает за управление отображением фильтров для списка фильмов.
 * Класс взаимодействует с моделью фильмов и моделью фильтров для получения данных о фильмах и текущем выбранном фильтре, а также обновляет представление фильтров при изменении данных в моделях.
 * В конструкторе класса принимаются контейнер для отображения фильтров, модель фильмов и модель фильтров. Класс также добавляет себя в качестве наблюдателя к обеим моделям, чтобы реагировать на изменения данных и обновлять представление фильтров соответственно.
 * Метод init() отвечает за инициализацию представления фильтров, создавая новый компонент FilterView с данными о фильмах и текущем выбранном фильтре, и отображая его в контейнере. Метод #modelEventHandler() обрабатывает события от обеих моделей и вызывает метод init() для обновления представления фильтров при получении события от модели фильмов или модели фильтров. Метод #filterTypeChangeHandler() обрабатывает изменения выбранного фильтра и обновляет модель фильтров с новым выбранным фильтром.
 * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонента фильтров. При первом отображении компонента используется метод render, а при последующих обновлениях используется метод replace для замены старого компонента новым, и метод remove для удаления старого компонента из DOM.
 */

import FilterView from '../view/filter-view.js';
import {remove, render, replace} from '../framework/render.js';
import {FilterType, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class FilterPresenter {
  #container = null;
  #filterComponent = null;

  #currentFilter = null;

  #filmsModel = null;
  #filterModel = null;

  constructor(container, filmsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const films = this.#filmsModel.get();

    return [
      {
        name: FilterType.ALL,
        count: filter[FilterType.ALL](films).length
      },
      {
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length
      }
    ];
  }

  init() {
    this.#currentFilter = this.#filterModel.get();

    const filters = this.filters;

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#currentFilter);
    this.#filterComponent.setFilterTypeClickHandler(this.#filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.get === filterType) {
      return;
    }

    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };
}
