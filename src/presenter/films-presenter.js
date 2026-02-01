import SortView from '../view/sort-view.js';
import FilmsView from '../view/film-list/films-view.js';
import FilmListView from '../view/film-list/film-list-view.js';
import FilmListEmptyView from '../view/film-list/film-list-empty-view.js';
import FilmListContainerView from '../view/film-list/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';

import FilmPresenter from './film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import { remove, render, replace } from '../framework/render.js';
import { FILM_COUNT_PER_STEP, SortType, UserAction, UpdateType } from '../const.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';

export default class FilmsPresenter {
  #sortComponent = null;
  #filmListEmptyViewComponent = new FilmListEmptyView();
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = null;

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderFilmBoard();
  };

  #filmButtonMoreClickHandler = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms( films, this.#filmListContainerComponent);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  };

  #renderFilmButtonMore(container) {
    this.#filmButtonMoreComponent = new FilmButtonMoreView();

    this.#filmButtonMoreComponent.setButtonClickHandler(() =>
      this.#filmButtonMoreClickHandler());

    render(this.#filmButtonMoreComponent, container);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.ADD_COMMENT: {
        this.#commentsModel.addComment(updateType, update);

        const updatedFilm = {
          ...this.#selectedFilm,
          comments: [...this.#selectedFilm.comments, update.id]
        };

        this.#selectedFilm = updatedFilm;

        this.#filmsModel.updateFilm(UpdateType.MINOR, updatedFilm);
        break;
      }

      case UserAction.DELETE_COMMENT: {
        this.#commentsModel.deleteComment(updateType, update);

        const updatedFilm = {
          ...this.#selectedFilm,
          comments: this.#selectedFilm.comments.filter(
            (id) => id !== update.id
          )
        };

        this.#selectedFilm = updatedFilm;
        this.#filmsModel.updateFilm(UpdateType.MINOR, updatedFilm);
        break;
      }
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);

        if (
          this.#filmDetailsPresenter &&
          this.#selectedFilm &&
          this.#selectedFilm.id === data.id
        ) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();

        if (this.#selectedFilm) {
          const freshFilm = this.#filmsModel.films.find(
            (film) => film.id === this.#selectedFilm.id
          );

          this.#selectedFilm = freshFilm;
        }

        this.#renderFilmBoard();

        if (this.#selectedFilm) {
          this.#renderFilmDetails();
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#currentSortType = SortType.DEFAULT;
        this.#renderFilmBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard({resetRenderedFilmsCount: true});
    this.#renderSort(this.#container);
    this.#renderFilmBoard();
  };

  #renderSort(container) {
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }

    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleViewAction,
      this.#addFilmDetailsComponent,
      this.#onEscKeyDown,
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms(films, container) {
    films.forEach((film) => this.#renderFilm(film, container));
  }

  #renderFilmListContainer = (container) => {
    render(this.#filmsComponent, container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  };

  #renderFilmDetails = () => {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#handleViewAction,
        this.#removeFilmDetailsComponent,
        this.#onEscKeyDown
      );
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #addFilmDetailsComponent = (film) => {
    if (this.#selectedFilm && this.#selectedFilm.id === film.id) {
      return;
    }

    if (this.#selectedFilm && this.#selectedFilm.id !== film.id) {
      this.#removeFilmDetailsComponent();
    }

    this.#selectedFilm = film;
    this.#renderFilmDetails();

    document.body.classList.add('hide-overflow');
  };

  #renderFilmListEmptyView = () => {
    render(this.#filmListEmptyViewComponent, this.#container);
  };

  #renderFilmBoard = () => {
    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderFilmListEmptyView();
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)), this.#filmListContainerComponent);

    if (filmCount > this.#renderedFilmCount) {
      this.#renderFilmButtonMore(this.#filmListComponent.element);
    }
  };

  #clearFilmBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#filmsComponent);
    remove(this.#filmListComponent);
    remove(this.#filmListContainerComponent);
    remove(this.#filmListEmptyViewComponent);
    remove(this.#filmButtonMoreComponent);

    this.#sortComponent = null;

    if (resetRenderedFilmsCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
