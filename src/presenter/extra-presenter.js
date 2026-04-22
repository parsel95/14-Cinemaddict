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
