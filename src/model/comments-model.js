import {generateComments} from '../mock/comment.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #filmsModel = null;
  #allComments = [];
  #comments = [];

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#generateAllComments();
  }

  #generateAllComments() {
    this.#allComments = generateComments(this.#filmsModel.films);
  }

  get = (film) => {
    this.#comments = film.comments
      .map((commentId) => {
        const comment = this.#allComments.find(
          (item) => item.id === commentId
        );
        return comment ?? null;
      })
      .filter((comment) => comment !== null);

    return this.#comments;
  };

  addComment = (updateType, update) => {
    this.#allComments = [
      ...this.#allComments,
      update,
    ];
    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#allComments.findIndex(
      (item) => item.id === update.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#allComments = [
      ...this.#allComments.slice(0, index),
      ...this.#allComments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
