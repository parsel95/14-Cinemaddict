/**
 * @file comments-model.js
 * @description
 * Файл содержит реализацию класса CommentsModel, который отвечает за управление данными о комментариях к фильмам и взаимодействием с сервером для получения, добавления и удаления комментариев.
 * Класс наследуется от Observable и предоставляет методы для получения комментариев к фильму, добавления нового комментария и удаления существующего комментария. Методы выполняют асинхронные операции по взаимодействию с сервером и обновлению данных о комментариях, а также уведомляют наблюдателей об изменении состояния при добавлении или удалении комментария.
 * Класс CommentsModel используется в приложении для управления данными о комментариях к фильмам, а также для взаимодействия с сервером для получения, добавления и удаления комментариев. Презентеры и представления в приложении используют методы этого класса для получения данных о комментариях и обновления их состояния при взаимодействии с пользователем.
 */

import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #comments = [];
  #apiService = null;
  #filmsModel = null;

  constructor(apiService, filmsModel) {
    super();
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
  }

  get = async (film) => {
    this.#comments = await this.#apiService.get(film);
    return this.#comments;
  };

  add = async (updateType, film, createdComment) => {
    try {
      const response = await this.#apiService.add(film, createdComment);

      this.#comments = response.comments;

      this.#filmsModel.updateOnClient({
        updateType,
        update: response.movie,
        isAdapted: false
      });
    } catch {
      throw new Error('Can\'t add comment');
    }
  };

  delete = async (updateType, film, deletedComment) => {
    const index = this.#comments.findIndex(
      (comment) => comment.id === deletedComment.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.delete(deletedComment);

      const updateFilm = {
        ...film,
        comments: [
          ...film.comments.slice(0, index),
          ...film.comments.slice(index + 1)
        ]
      };

      this.#filmsModel.updateOnClient({
        updateType,
        update: updateFilm,
        isAdapted: true
      });
    } catch {
      throw new Error('Can\'t delete comment');
    }
  };
}
