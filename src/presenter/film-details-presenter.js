/**
 * @file film-details-presenter.js
 * @description
 * Файл содержит реализацию класса FilmDetailsPresenter, который отвечает за управление отображением подробной информации о фильме и взаимодействием с ней.
 * Класс взаимодействует с моделью фильма для получения данных о фильме и обновления его состояния, а также с представлением подробной информации о фильме для отображения информации и обработки пользовательских действий.
 * В конструкторе класса принимаются контейнер для отображения подробной информации о фильме, функция для изменения данных фильма, функция для обработки клика по кнопке закрытия подробной информации и функция для обработки нажатия клавиши Escape. Класс также содержит методы для инициализации подробной информации о фильме, уничтожения ее отображения, управления состоянием создания комментария, удаления комментария, редактирования фильма и обработки ошибок при сохранении изменений.
 * Метод init() отвечает за инициализацию подробной информации о фильме, создавая новый компонент FilmDetailsView с данными о фильме, комментариях и состоянием загрузки комментариев, и отображая его в контейнере. Метод destroy() удаляет компонент подробной информации о фильме из DOM. Методы setCommentCreating(), setCommentDeleting(), setFilmEditing() и setAborting() управляют состоянием создания комментария, удаления комментария, редактирования фильма и обработки ошибок при сохранении изменений соответственно. Метод createComment() обрабатывает создание нового комментария, проверяя наличие выбранной эмоции и текста комментария, и вызывает функцию для изменения данных фильма с новым комментарием.
 * Презентер использует методы render, replace и remove из фреймворка для управления отображением компонента подробной информации о фильме в DOM.
 */

import FilmDetailsView from '../view/film-details/film-details-view.js';
import {render, replace, remove} from '../framework/render.js';
import {UpdateType, UserAction} from '../const.js';

export default class FilmDetailsPresenter {
  #container = null;

  #changeData = null;
  #closeBtnClickHandler = null;
  #escKeyDownHandler = null;

  #filmDetailsComponent = null;

  #film = null;
  #comments = null;

  #viewData = {
    emotion: null,
    comment: null,
    scrollPosition: 0
  };

  constructor(container, changeData, closeBtnClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#closeBtnClickHandler = closeBtnClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }

  init = (film, comments, isCommentLoadingError) => {
    this.#film = film;

    this.#comments = (!isCommentLoadingError)
      ? comments
      : [];

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView(
      this.#film,
      this.#comments,
      this.#viewData,
      this.#updateViewData,
      isCommentLoadingError
    );

    this.#filmDetailsComponent.setCloseBtnClickHandler(() => {
      this.#closeBtnClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmDetailsComponent.setWatchlistBtnClickHandler(this.#watchlistBtnClickHandler);
    this.#filmDetailsComponent.setWatchedBtnClickHandler(this.#watchedBtnClickHandler);
    this.#filmDetailsComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler);

    if (!isCommentLoadingError) {
      this.#filmDetailsComponent.setCommentDeleteClickHandler(this.#commentDeleteClickHandler);
    }

    if (prevFilmDetailsComponent === null) {
      render(this.#filmDetailsComponent, this.#container);
      return;
    }

    replace(this.#filmDetailsComponent, prevFilmDetailsComponent);

    this.#filmDetailsComponent.setScrollPosition();

    remove(prevFilmDetailsComponent);
  };

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };

  clearViewData = () => {
    this.#updateViewData({
      comment: null,
      emotion: null,
      scrollPosition: this.#viewData.scrollPosition
    });

    this.#filmDetailsComponent.updateElement({
      checkedEmotion: this.#viewData.emotion,
      comment: this.#viewData.comment,
      scrollPosition: this.#viewData.scrollPosition
    });
  };

  setCommentCreating = () => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      isCommentCreating: true
    });
  };

  setCommentDeleting = (commentId) => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      deleteCommentId: commentId
    });
  };

  setFilmEditing = () => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: true,
      isFilmEditing: true,
    });
  };

  setAborting = ({actionType, commentId}) => {
    this.#filmDetailsComponent.updateElement({
      ...this.#viewData,
      isDisabled: false,
      deleteCommentId: null,
      isFilmEditing: false,
    });

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmDetailsComponent.shakeControls();
        break;
      case UserAction.ADD_COMMENT:
        this.#filmDetailsComponent.shakeForm();
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmDetailsComponent.shakeComment(commentId);
        break;
    }
  };

  createComment = () => {
    this.#filmDetailsComponent.setCommentData();

    const {emotion, comment} = this.#viewData;

    if (emotion && comment) {
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        this.#film,
        {emotion, comment}
      );
    } else {
      this.#filmDetailsComponent.shakeForm();
    }
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
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
      }
    );
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

  #commentDeleteClickHandler = (commentId) => {
    const deletedComment = this.#comments
      .find((comment) => comment.id === commentId);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#film,
      deletedComment
    );
  };
}


