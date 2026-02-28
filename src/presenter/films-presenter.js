import SortView from '../view/sort-view.js';
import FilmsView from '../view/film-list/films-view.js';
import FilmListView from '../view/film-list/film-list-view.js';
import FilmListEmptyView from '../view/film-list/film-list-empty-view.js';
import FilmListLoadingView from '../view/film-list/film-list-loading-view.js';
import FilmListContainerView from '../view/film-list/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';

import FilmPresenter from '../presenter/film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove, replace} from '../framework/render.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';
import {FILM_COUNT_PER_STEP, SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsPresenter {
  #sortComponent = null;
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #filmListEmptyComponent = new FilmListEmptyView();
  #filmListLoadingComponent = new FilmListLoadingView();

  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get films() {
    const filterType = this.#filterModel.get();
    const films = this.#filmsModel.get();

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

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        if (
          this.#filmPresenter.get(updateFilm.id) &&
          !this.#filmDetailsPresenter
        ) {
          this.#filmPresenter.get(updateFilm.id).setFilmEditing();
        }

        if (this.#filmDetailsPresenter) {
          this.#filmDetailsPresenter.setFilmEditing();
        }

        try {
          await this.#filmsModel.updateOnServer(updateType, updateFilm);
        } catch {
          if (
            this.#filmPresenter.get(updateFilm.id) &&
            !this.#filmDetailsPresenter
          ) {
            this.#filmPresenter.get(updateFilm.id).setAborting();
          }

          if (this.#filmDetailsPresenter) {
            this.#filmDetailsPresenter.setAborting({actionType});
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmDetailsPresenter.setCommentCreating();
        try {
          await this.#commentsModel.add(updateType, updateFilm, updateComment);
          this.#filmDetailsPresenter.clearViewData();
        } catch {
          this.#filmDetailsPresenter.setAborting({actionType});
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmDetailsPresenter.setCommentDeleting(updateComment.id);
        try {
          await this.#commentsModel.delete(updateType, updateFilm, updateComment);
        } catch {
          this.#filmDetailsPresenter.setAborting({actionType, commentId: updateComment.id});
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data);
        }
        if (this.#filmDetailsPresenter && this.#selectedFilm.id === data.id) {
          this.#selectedFilm = data;
          this.#renderFilmDetails();
        }
        if (this.#filterModel.get() !== FilterType.ALL) {
          this.#modelEventHandler(UpdateType.MINOR);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#filmListLoadingComponent);
        this.#renderFilmBoard();
        break;
    }
  };

  #renderFilmButtonMore(container) {
    render(this.#filmButtonMoreComponent, container);
    this.#filmButtonMoreComponent.setButtonClickHandler(() =>
      this.#filmButtonMoreClickHandler()
    );
  }

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const films = this.films.slice(0, Math.min(this.films.length, FILM_COUNT_PER_STEP));
    this.#clearFilmList();
    this.#renderSort(this.#container);
    this.#renderFilmList(films);
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

  #renderFilmListContainer(container) {
    render(this.#filmsComponent, container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  }

  #renderFilmList(films) {
    this.#renderFilms(
      films,
      this.#filmListContainerComponent
    );

    if (this.films.length > FILM_COUNT_PER_STEP) {
      this.#renderFilmButtonMore(this.#filmListComponent.element);
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#filmButtonMoreComponent);
  };

  #renderFilms(films, container) {
    films
      .forEach((film) =>
        this.#renderFilm(film, container)
      );
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#viewActionHandler,
      this.#addFilmDetailsComponent,
      this.#onEscKeyDown
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilmDetails = async () => {
    const comments = await this.#commentsModel.get(this.#selectedFilm);

    const isCommentLoadingError = !comments;

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#viewActionHandler,
        this.#removeFilmDetailsComponent,
        this.#onEscKeyDown
      );
    }

    if (!isCommentLoadingError) {
      document.addEventListener('keydown', this.#onCtrlEnterDown);
    }

    this.#filmDetailsPresenter.init(this.#selectedFilm, comments, isCommentLoadingError);
  };

  #renderFilmBoard() {
    const films = this.films.slice(0, Math.min(this.films.length, FILM_COUNT_PER_STEP));

    if (this.#isLoading) {
      render(this.#filmListLoadingComponent, this.#container);
      return;
    }

    if (!this.#isLoading && films.length === 0) {
      render(this.#filmListEmptyComponent, this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderFilmListContainer(this.#container);
    this.#renderFilmList(films);
  }

  #clearFilmBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#filmListEmptyComponent);
    remove(this.#filmButtonMoreComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
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

  #removeFilmDetailsComponent = () => {
    document.removeEventListener('keydown', this.#onCtrlEnterDown);

    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
    this.#selectedFilm = null;

    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };

  #filmButtonMoreClickHandler() {
    const filmsCount = this.films.length;

    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);

    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmListContainerComponent);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#filmButtonMoreComponent);
    }
  }
}

