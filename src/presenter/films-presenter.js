/**
 * @file films-presenter.js
 * @description
 * Файл содержит реализацию класса FilmsPresenter, который отвечает за управление отображением списка фильмов, сортировкой, фильтрацией и взаимодействием с деталями фильма.
 * Класс взаимодействует с моделями фильмов, комментариев и фильтров для получения данных и обновления представления при изменении данных в моделях. В конструкторе класса принимаются контейнер для отображения списка фильмов, модели фильмов, комментариев и фильтров. Класс также добавляет себя в качестве наблюдателя к моделям фильмов и фильтров, чтобы реагировать на изменения данных и обновлять представление соответственно.
 * Метод init() отвечает за инициализацию представления списка фильмов, вызывая метод #renderFilmBoard(). Метод #viewActionHandler() обрабатывает действия пользователя, такие как обновление фильма, добавление комментария и удаление комментария, и вызывает соответствующие методы для обработки этих действий. Методы #handleUpdateFilm(), #handleAddComment() и #handleDeleteComment() выполняют асинхронные операции по обновлению фильма, добавлению комментария и удалению комментария соответственно, с блокировкой интерфейса во время выполнения операции и обработкой ошибок.
 * Метод #modelEventHandler() обрабатывает события от моделей и вызывает соответствующие методы для обновления представления в зависимости от типа события. Методы #handlePatch(), #updateFilm(), #updateFilmDetails(), #handleMinorOrMajor() и #handleInit() выполняют обновление представления в зависимости от типа события.
 * Методы #renderFilmButtonMore(), #filmButtonMoreClickHandler(), #sortTypeChangeHandler(), #renderSort(), #renderFilmListContainer(), #renderFilmList(), #clearFilmList(), #renderFilm(), #renderFilmDetails(), #addFilmDetailsComponent(), #removeFilmDetailsComponent(), #createTopRatedList(), #createMostCommentedList(), #renderExtraList(), #renderExtraLists(), #updateExtraLists(), #clearExtraLists(), #renderFilmBoard() и #clearFilmBoard() выполняют различные задачи по отображению и обновлению представления списка фильмов, сортировки, фильтрации и деталей фильма.
 * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонентов в DOM, а также использует класс UiBlocker для блокировки интерфейса во время выполнения асинхронных операций.
 * Класс FilmsPresenter является центральным компонентом, который связывает модели и представления, обеспечивая взаимодействие между ними и управление отображением данных о фильмах в приложении.
*/

import SortView from '../view/sort-view.js';
import FilmsView from '../view/film-list/films-view.js';
import FilmListView from '../view/film-list/film-list-view.js';
import FilmListEmptyView from '../view/film-list/film-list-empty-view.js';
import FilmListLoadingView from '../view/film-list/film-list-loading-view.js';
import FilmListContainerView from '../view/film-list/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';

import FilmPresenter from '../presenter/film-presenter.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import ExtraPresenter from './extra-presenter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove, replace} from '../framework/render.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByComments} from '../utils/film.js';
import {FILM_COUNT_PER_STEP, SortType, UserAction, UpdateType, FilterType, ExtraType} from '../const.js';
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
  #filmsForExtra = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  #filmPresenter = new Map();
  #filmDetailsPresenter = null;
  #filmsTopRatedPresenter = null;
  #filmsMostCommentedPresenter = null;

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
        return [...filteredFilms].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...filteredFilms].sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderFilmBoard();
  };

  #viewActionHandler = async (actionType, updateType, updateFilm, updateComment) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_FILM:
          await this.#handleUpdateFilm(updateType, updateFilm);
          break;

        case UserAction.ADD_COMMENT:
          await this.#handleAddComment(updateType, updateFilm, updateComment);
          break;

        case UserAction.DELETE_COMMENT:
          await this.#handleDeleteComment(updateType, updateFilm, updateComment);
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  async #handleUpdateFilm(updateType, updateFilm) {
    const presenters = this.#filmPresenter.get(updateFilm.id);
    if (presenters && !this.#filmDetailsPresenter) {
      presenters.forEach((presenter) => presenter.setFilmEditing());
    }

    if (this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter.setFilmEditing();
    }

    try {
      await this.#filmsModel.updateOnServer(updateType, updateFilm);
    } catch {
      if (presenters && !this.#filmDetailsPresenter) {
        presenters.forEach((presenter) => presenter.setAborting());
      }

      if (this.#filmDetailsPresenter) {
        this.#filmDetailsPresenter.setAborting({actionType: UserAction.UPDATE_FILM});
      }
    }
  }

  async #handleAddComment(updateType, updateFilm, updateComment) {
    this.#filmDetailsPresenter.setCommentCreating();
    try {
      await this.#commentsModel.add(updateType, updateFilm, updateComment);
      this.#filmDetailsPresenter.clearViewData();
    } catch {
      this.#filmDetailsPresenter.setAborting({actionType: UserAction.ADD_COMMENT});
    }
  }

  async #handleDeleteComment(updateType, updateFilm, updateComment) {
    this.#filmDetailsPresenter.setCommentDeleting(updateComment.id);
    try {
      await this.#commentsModel.delete(updateType, updateFilm, updateComment);
    } catch {
      this.#filmDetailsPresenter.setAborting({
        actionType: UserAction.DELETE_COMMENT,
        commentId: updateComment.id
      });
    }
  }

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handlePatch(data);
        break;

      case UpdateType.MINOR:
        this.#handleMinorOrMajor(UpdateType.MINOR);
        break;

      case UpdateType.MAJOR:
        this.#handleMinorOrMajor(UpdateType.MAJOR);
        break;

      case UpdateType.INIT:
        this.#handleInit();
        break;
    }
  };

  #handlePatch(data) {
    this.#updateFilm(data);
    this.#updateFilmDetails(data);
    this.#updateExtraLists();

    if (this.#filterModel.get() !== FilterType.ALL) {
      this.#handleMinorOrMajor(UpdateType.MINOR);
    }
  }

  #updateFilm(film) {
    if (this.#filmPresenter.has(film.id)) {
      this.#filmPresenter.get(film.id).forEach((presenter) => {
        presenter.init(film);
      });
    }
  }

  #updateFilmDetails(film) {
    if (this.#filmDetailsPresenter && this.#selectedFilm.id === film.id) {
      this.#selectedFilm = film;
      this.#renderFilmDetails();
    }
  }

  #handleMinorOrMajor(updateType) {
    if (updateType === UpdateType.MINOR) {
      this.#clearFilmBoard();
    }

    if (updateType === UpdateType.MAJOR) {
      this.#clearFilmBoard({resetRenderedFilmCount: true, resetSortType: true});
    }

    this.#renderFilmBoard();
  }

  #handleInit() {
    this.#isLoading = false;
    remove(this.#filmListLoadingComponent);
    this.#renderFilmBoard();
  }

  #renderFilmButtonMore(container) {
    render(this.#filmButtonMoreComponent, container);
    this.#filmButtonMoreComponent.setButtonClickHandler(() =>
      this.#filmButtonMoreClickHandler()
    );
  }

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

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const films = this.films.slice(0, Math.min(this.films.length, FILM_COUNT_PER_STEP));
    this.#clearFilmList();
    this.#renderSort(this.#container);
    this.#renderFilmList(films, this.#filmListContainerComponent);
    this.#updateExtraLists();
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

  #renderFilmList(films, container) {
    this.#renderFilms(
      films,
      container
    );

    if (this.films.length > FILM_COUNT_PER_STEP) {
      this.#renderFilmButtonMore(this.#filmListComponent.element);
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenters) => {
      presenters.forEach((presenter) => presenter.destroy());
    });
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

    if (!this.#filmPresenter.has(film.id)) {
      this.#filmPresenter.set(film.id, []);
    }

    this.#filmPresenter.get(film.id).push(filmPresenter);
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

  #createTopRatedList() {
    this.#filmsTopRatedPresenter = new ExtraPresenter({
      extraType: ExtraType.TOP_RATED,
      films: this.#filmsForExtra,
      sortFunction: sortFilmsByRating
    });

    render(this.#filmsTopRatedPresenter.component, this.#filmsComponent.element);

    this.#renderExtraList(this.#filmsTopRatedPresenter);
  }

  #createMostCommentedList() {
    this.#filmsMostCommentedPresenter = new ExtraPresenter({
      extraType: ExtraType.MOST_COMMENTED,
      films: this.#filmsForExtra,
      sortFunction: sortFilmsByComments
    });

    this.#renderExtraList(this.#filmsMostCommentedPresenter);
  }

  #renderExtraList(presenter) {
    render(presenter.component, this.#filmsComponent.element);
    render(presenter.container, presenter.component.element);

    this.#renderFilms(
      presenter.films,
      presenter.container
    );
  }

  #renderExtraLists() {
    this.#createTopRatedList();
    this.#createMostCommentedList();
  }

  #updateExtraLists() {
    this.#filmsForExtra = this.#filmsModel.get();
    this.#clearExtraLists();
    this.#renderExtraLists();
  }

  #clearExtraLists() {
    if (this.#filmsTopRatedPresenter) {
      remove(this.#filmsTopRatedPresenter.component);
    }

    if (this.#filmsMostCommentedPresenter) {
      remove(this.#filmsMostCommentedPresenter.component);
    }

    this.#filmsTopRatedPresenter = null;
    this.#filmsMostCommentedPresenter = null;
  }

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

    this.#filmsForExtra = this.#filmsModel.get();
    this.#renderExtraLists();

    this.#renderFilmList(films, this.#filmListContainerComponent);
  }

  #clearFilmBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenters) => {
      presenters.forEach((presenter) => presenter.destroy());
    });
    this.#filmPresenter.clear();

    remove(this.#filmListEmptyComponent);
    remove(this.#filmButtonMoreComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#clearExtraLists();
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
}

