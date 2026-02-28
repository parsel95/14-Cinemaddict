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
