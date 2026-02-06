import FilmDetailsView from '../view/film-details/film-details-view.js';
import { render, remove, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class FilmDetailsPresenter {
  #container = null;

  #changeData = null;
  #escKeyDownHandler = null;
  #closeBtnClickHandler = null;

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

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView(
      this.#film,
      this.#comments,
      this.#viewData,
      this.#updateViewData
    );

    this.#filmDetailsComponent.setCloseBtnClickHandler(() => {
      this.#closeBtnClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmDetailsComponent.setWatchlistBtnClickHandler(this.#watchlistBtnClickHandler);
    this.#filmDetailsComponent.setWatchedBtnClickHandler(this.#watchedBtnClickHandler);
    this.#filmDetailsComponent.setFavoriteBtnClickHandler(this.#favoriteBtnClickHandler);
    this.#filmDetailsComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.#filmDetailsComponent.setDeleteCLickHandler(this.#handleDeleteClick);

    if (prevFilmDetailsComponent === null) {
      render(this.#filmDetailsComponent, this.#container);
      return;
    }

    replace(this.#filmDetailsComponent, prevFilmDetailsComponent);

    this.#filmDetailsComponent.setScrollPosition();

    remove(prevFilmDetailsComponent);
  };

  #handleCommentSubmit = ({comment, emotion}) => {
    const newComment = {
      id: Math.random().toString(36).slice(2, 10),
      comment,
      emotion,
      author: 'User',
      date: new Date().toISOString()
    };

    this.#viewData = {
      emotion: null,
      comment: '',
      scrollPosition: this.#viewData.scrollPosition
    };

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      newComment
    );


  };

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };

  #updateViewData = (viewData) => {
    this.#viewData = {...viewData};
  };

  #watchlistBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        }
      }
    );
  };

  #watchedBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      }
    );
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        }
      }
    );
  };

  #handleDeleteClick = (commentId) => {
    const comment = this.#comments.find(
      (item) => item.id === commentId
    );

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      comment
    );
  };
}


