import AbstractView from '../../framework/view/abstract-view.js';
import { FilterType } from '../../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies in your watchlist',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmListEmptyViewTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return (
    `
      <section class="films-list">
        <h2 class="films-list__title">${noFilmsTextValue}</h2>
      </section>
    `
  );
};

export default class FilmListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createFilmListEmptyViewTemplate(this.#filterType);
  }
}
