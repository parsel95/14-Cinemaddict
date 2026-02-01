import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPE_ALL_NAME, FilterType} from '../const.js';

const createFilterItemTemplate = ({type, count}, currentFilterType) => {
  const getFilterName = (filterName) =>
    (filterName === FilterType.ALL)
      ? FILTER_TYPE_ALL_NAME
      : `${filterName.charAt(0).toUpperCase()}${filterName.slice(1)}`;

  const getFilterTextContent = (filterName) =>
    (filterName !== FilterType.ALL)
      ? `<span class="main-navigation__item-count">${count}</span>`
      : '';

  return `
    <a
      href="#${type}"
      class="
        main-navigation__item
        ${(type === currentFilterType) ? 'main-navigation__item--active' : ''}
      "
      data-filter-type="${type}"
    >
      ${getFilterName(type)}
      ${getFilterTextContent(type)}
    </a>
  `;
};

const createFilterViewTemplate = (filters, currentFilterType) => {
  const filterItems = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <nav class="main-navigation">
      ${filterItems}
    </nav>
  `;
};


export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterViewTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const filterLink = evt.target.closest('a[data-filter-type]');

    if (!filterLink) {
      return;
    }

    this._callback.filterTypeChange(filterLink.dataset.filterType);
  };
}
