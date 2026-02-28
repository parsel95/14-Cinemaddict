/* eslint-disable indent */
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {createFilmDetailsInfoTemplate} from './film-details-info-template.js';
import {createFilmDetailsCommentsTemplate} from './film-details-comments-template.js';
import {createFilmDetailsFormTemplate} from './film-details-form-template.js';
import {createFilmDetailsControlsTemplate} from './film-details-controls-template.js';

const createFilmDetailsTemplate = ({
  filmInfo, userDetails, comments, checkedEmotion,
  comment, isCommentLoadingError, isDisabled,
  deleteCommentId
}) =>
  `
    <section class="film-details">
      <div class="film-details__inner">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>

          ${createFilmDetailsInfoTemplate(filmInfo)}

          ${createFilmDetailsControlsTemplate(userDetails)}

        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">
            ${((isCommentLoadingError)
              ? `
                😵‍💫 Sorry, but we can't load comments. Try to refresh the page. Thanks for understanding.
                `
              : `
                Comments <span class="film-details__comments-count">${comments.length}</span>
                `
            )}
            </h3>
            ${(!isCommentLoadingError) ? createFilmDetailsCommentsTemplate(comments, deleteCommentId) : ''}

            ${createFilmDetailsFormTemplate(checkedEmotion, comment, isCommentLoadingError, isDisabled)}

          </section>
        </div>
      </div>
    </section>
  `;

export default class FilmDetailsView extends AbstractStatefulView {

  constructor(film, comments, viewData, updateViewData, isCommentLoadingError) {
    super();
    this._state = FilmDetailsView.parseFilmToState(
      film,
      comments,
      viewData.emotion,
      viewData.comment,
      viewData.scrollPosition,
      isCommentLoadingError
    );
    this.updateViewData = updateViewData;

    if (!isCommentLoadingError) {
      this.#setInnerHandlers();
    }
  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  shakeComment = (commentId) => {
    const commentElement = this.element.querySelector(`li[data-comment-id='${commentId}']`);
    this.shake.call({element: commentElement});
  };

  shakeForm = () => {
    const formElement = this.element.querySelector('.film-details__new-comment');
    this.shake.call({element: formElement});
  };

  shakeControls = () => {
    const controlsElement = this.element.querySelector('.film-details__controls');
    this.shake.call({element: controlsElement});
  };

  _restoreHandlers = () => {
    this.setScrollPosition();
    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setWatchlistBtnClickHandler(this._callback.watchlistBtnClick);
    this.setWatchedBtnClickHandler(this._callback.watchedBtnClick);
    this.setFavoriteBtnClickHandler(this._callback.favoriteBtnClick);

    if (!this._state.isCommentLoadingError && !this._state.isDisabled) {
      this.#setInnerHandlers();
      this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    }
  };

  setCommentData = () => {
    this.#updateViewData();
  };

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollPosition;
  };

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeBtnClickHandler);
  }

  setWatchlistBtnClickHandler(callback) {
    this._callback.watchlistBtnClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistBtnClickHandler);
  }

  setWatchedBtnClickHandler(callback) {
    this._callback.watchedBtnClick = callback;
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedBtnClickHandler);
  }

  setFavoriteBtnClickHandler(callback) {
    this._callback.favoriteBtnClick = callback;
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteBtnClickHandler);
  }

  setCommentDeleteClickHandler(callback) {
    const commentDeleteElements = this.element.querySelectorAll('.film-details__comment-delete');

    if (commentDeleteElements) {
      this._callback.commentDeleteClick = callback;
      commentDeleteElements.forEach(
        (element) =>
          element.addEventListener('click', this.#commentDeleteClickHandler, true)
      );
    }
  }

  #closeBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeBtnClick();
  };

  #watchlistBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchlistBtnClick();
  };

  #watchedBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.watchedBtnClick();
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.favoriteBtnClick();
  };

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedEmotion: evt.currentTarget.dataset.emotionType,
      scrollPosition: this.element.scrollTop
    });
  };

  #commentInputChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({comment: evt.target.value});
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#updateViewData();
    this._callback.commentDeleteClick(evt.target.dataset.commentId);
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-label')
      .forEach((element) => {
        element.addEventListener('click', this.#emotionClickHandler);
      });
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputChangeHandler);
  };

  #updateViewData = () => {
    this.updateViewData({
      emotion: this._state.checkedEmotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop
    });
  };

  static parseFilmToState = (
    film,
    comments,
    checkedEmotion = null,
    comment = null,
    scrollPosition = 0,
    isCommentLoadingError = false
  ) => ({
    ...film,
    comments,
    isCommentLoadingError,
    checkedEmotion,
    comment,
    scrollPosition,
    isDisabled: false,
    deleteCommentId: null,
    isFilmEditing: false
  });
}
