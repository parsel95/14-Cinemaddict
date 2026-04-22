/**
 * @file film-presenter.js
 * @description
 * Файл содержит реализацию класса FilmPresenter, который отвечает за управление отображением карточки фильма и взаимодействием с ней.
 * Класс взаимодействует с моделью фильма для получения данных о фильме и обновления его состояния, а также с представлением карточки фильма для отображения информации и обработки пользовательских действий.
 * В конструкторе класса принимаются контейнер для отображения карточки фильма, функция для изменения данных фильма, функция для обработки клика по карточке фильма и функция для обработки нажатия клавиши Escape. Класс также содержит методы для инициализации карточки фильма, уничтожения ее отображения, установки состояния редактирования и обработки действий пользователя (добавление в список "watchlist", отметка как просмотренного, добавление в избранное).
 * Метод init() отвечает за инициализацию карточки фильма, создавая новый компонент FilmCardView с данными о фильме и отображая его в контейнере. Метод destroy() удаляет компонент карточки фильма из DOM. Методы setFilmEditing() и setAborting() устанавливают состояние редактирования карточки фильма и обрабатывают ошибку при сохранении изменений соответственно. Методы #watchlistBtnClickHandler(), #watchedBtnClickHandler() и #favoriteBtnClickHandler() обрабатывают клики по соответствующим кнопкам в карточке фильма и вызывают функцию для изменения данных фильма с обновленными значениями.
 * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонента карточки фильма в DOM.
 */

import FilmCardView from '../view/film-card/film-card-view.js';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class FilmPresenter {
  #container = null;

  #changeData = null;
  #clickCardHandler = null;
  #escKeyDownHandler = null;

  #filmCardComponent = null;

  #film = null;

  constructor(container, changeData, clickCardHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);

    this.#filmCardComponent.setCardClickHandler(() => {
      this.#clickCardHandler(this.#film);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmCardComponent.setWatchlistBtnClickHandler(this.#watchlistBtnClickHandler);
    this.#filmCardComponent.setWatchedBtnClickHandler(this.#watchedBtnClickHandler);
    this.#filmCardComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#container.element);
      return;
    }

    replace(this.#filmCardComponent, prevFilmCardComponent);

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  setFilmEditing = () => {
    if (!this.#filmCardComponent) {
      return;
    }

    this.#filmCardComponent.updateElement({isFilmEditing: true});
  };

  setAborting = () => {
    if (!this.#filmCardComponent) {
      return;
    }

    this.#filmCardComponent.updateElement({isFilmEditing: false});
    this.#filmCardComponent.shakeControls();
  };

  #watchlistBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        },
      });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        }
      });
  };
}


