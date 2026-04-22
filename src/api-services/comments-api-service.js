/**
 * @file comments-api-service.js
 * @description
 * Файл содержит реализацию класса CommentsApiService, который отвечает за взаимодействие с сервером для получения, добавления и удаления комментариев к фильмам.
 * Класс наследуется от ApiService и предоставляет методы для получения комментариев к фильму, добавления нового комментария и удаления существующего комментария. Метод get() выполняет запрос к серверу для получения комментариев к указанному фильму и возвращает результат в виде массива объектов. Метод add() выполняет запрос к серверу для добавления нового комментария к фильму, отправляя данные комментария в формате JSON и возвращая обновленные данные фильма после успешного добавления комментария на сервере. Метод delete() выполняет запрос к серверу для удаления указанного комментария.
 * Класс CommentsApiService используется в приложении для взаимодействия с сервером при получении, добавлении и удалении комментариев к фильмам. Презентеры и модели в приложении используют методы этого класса для получения данных о комментариях и обновления их состояния при взаимодействии с пользователем.
 */

import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class CommentsApiService extends ApiService {
  get = (film) => this._load({url: `comments/${film.id}`})
    .then(ApiService.parseResponse)
    .catch(() => null);

  add = async (film, comment) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  delete = async (comment) => {
    await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'})
    });
  };
}
