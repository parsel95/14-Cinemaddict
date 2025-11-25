import SortView from '../view/sort-view.js';
import FilmsView from '../view/film-list/films-view.js';
import FilmListView from '../view/film-list/film-list-view.js';
import FilmListEmptyView from '../view/film-list/film-list-empty-view.js';
import FilmListContainerView from '../view/film-list/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmDetailsView from '../view/film-details/film-details-view.js';
import FilmPresenter from './film-presenter.js';

import FilmCardView from '../view/film-card/film-card-view.js';

import { render, remove } from '../framework/render.js';
import { FILM_COUNT_PER_STEP } from '../const.js';

export default class FilmsPresenter {
  #filmComponent = new FilmPresenter();
  #sortComponent = new SortView();
  #filmListEmptyViewComponent = new FilmListEmptyView();
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #filmDetailsComponent = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.get()];

    this.#renderFilmBoard();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#container);
  };

  #renderFilmListContainer = () => {
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  };

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));
  };

  #renderFilm = (film, container) => {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.setCardClickHandler(() => {
      this.#addFilmDetailsComponent(film);
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    render(filmCardComponent, container.element);
  };

  #renderFilmList = () => {
    this.#renderFilmListContainer();

    this.#renderFilms(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderFilmButtonMore();
    }
  };

  #renderFilmListEmptyView = () => {
    render(this.#filmListEmptyViewComponent, this.#container);
  };

  #renderFilmButtonMore = () => {
    render(this.#filmButtonMoreComponent, this.#filmListComponent.element);

    this.#filmButtonMoreComponent.setButtonClickHandler(() => this.#filmButtonMoreClickHandler());
  };

  #renderFilmDetails = (film) => {
    const comments = [...this.#commentsModel.get(film)];

    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    this.#filmDetailsComponent.setCloseBtnClickHandler(() => {
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    render(this.#filmDetailsComponent, this.#container.parentElement);
  };

  #addFilmDetailsComponent = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    remove(this.#filmDetailsComponent);
    this.#filmDetailsComponent = null;
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #filmButtonMoreClickHandler = () => {
    this.#renderFilms(
      this.#renderedFilmCount,
      this.#renderedFilmCount + FILM_COUNT_PER_STEP
    );

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  };

  #renderFilmBoard = () => {
    if (this.#films.length === 0) {
      this.#renderFilmListEmptyView();
      return;
    }

    this.#renderSort();
    this.#renderFilmList();
  };
}
